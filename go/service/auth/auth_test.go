package auth

import (
	"context"
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/auth/extuser"
	"github.com/yssk22/hpapp/go/service/bootstrap/test"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/entutil"
)

func TestAuth(t *testing.T) {
	test.New("invalid extuser token").Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		extauth := extuser.NewMockAuthenticator()
		u, err := appuser.Authenticate(extuser.WithUser(ctx, extauth.VerifyToken(ctx, "invalid")))
		a.Equals(appuser.ErrAuthenticationRequired, err)
		a.Nil(u)
	})

	test.New("mizuki and risa authenticates first time").Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		// setup extuser
		entclient := entutil.NewClient(ctx)
		extauth := extuser.NewMockAuthenticator(
			extuser.MockUser{ProviderName: "twitter", ProviderUserID: "mizuki.fukumura@twitter", ValidToken: "twitter-token-mizuki"},
			extuser.MockUser{ProviderName: "google", ProviderUserID: "mizuki.fukumura@google", ValidToken: "google-token-mizuki"},
			extuser.MockUser{ProviderName: "apple", ProviderUserID: "mizuki.fukumura@apple", ValidToken: "apple-token-mizuki"},
			extuser.MockUser{ProviderName: "google", ProviderUserID: "risa.irie@google", ValidToken: "google-token-risa"},
		)
		adminCtx := appuser.WithAdmin(ctx)

		mizuki, err := appuser.Authenticate(extuser.WithUser(ctx, extauth.VerifyToken(ctx, "twitter-token-mizuki")))
		a.Nil(err)
		a.Equals(16, len(mizuki.Username))
		a.Equals("mizuki.fukumura@twitter", entclient.User.GetX(adminCtx, mizuki.ID).QueryAuth().FirstX(adminCtx).ProviderUserID)
		a.OK(len(mizuki.AccessToken) > 0)
		verified := appuser.VerifyToken(ctx, mizuki.AccessToken)
		a.NotNil(verified)
		a.Equals(appuser.EntUser(mizuki).ID(), verified.ID())

		risa, err := appuser.Authenticate(extuser.WithUser(ctx, extauth.VerifyToken(ctx, "google-token-risa")))
		a.Nil(err)
		a.Equals(16, len(risa.Username))
		a.OK(mizuki.Username != risa.Username)
		a.Equals("risa.irie@google", entclient.User.GetX(adminCtx, risa.ID).QueryAuth().FirstX(adminCtx).ProviderUserID)
		a.OK(len(risa.AccessToken) > 0)
		verified = appuser.VerifyToken(ctx, risa.AccessToken)
		a.NotNil(verified)
		a.Equals(appuser.EntUser(risa).ID(), verified.ID())

		t.Run("mizuki refreshes her access token", func(t *testing.T) {
			t.Run("should fail without extuser token", func(t *testing.T) {
				a := assert.NewTestAssert(t)
				mizukiCtx := appuser.WithUser(ctx, appuser.EntUser(mizuki))
				_, err := appuser.Authenticate(mizukiCtx)
				a.Equals(appuser.ErrAuthenticationRequired, err)

				_, err = appuser.Authenticate(ctx)
				a.Equals(appuser.ErrAuthenticationRequired, err)
			})
			mizukiCtx := appuser.WithUser(ctx, appuser.EntUser(mizuki))

			// AccsesToken should be updated by authenticating external provider again.
			mizukiAuthenticated, err := appuser.Authenticate(extuser.WithUser(mizukiCtx, extauth.VerifyToken(ctx, "twitter-token-mizuki")))
			a.Nil(err)
			a.Equals(mizukiAuthenticated.ID, mizuki.ID)
			a.OK(mizukiAuthenticated.AccessToken != mizuki.AccessToken, "AccessToken should be updated after Authenticate")

			// even from the guest context (no user should be created by this operation)
			mizukiAuthenticated, err = appuser.Authenticate(extuser.WithUser(ctx, extauth.VerifyToken(ctx, "twitter-token-mizuki")))
			a.Nil(err)
			a.Equals(mizukiAuthenticated.ID, mizuki.ID)
			a.OK(mizukiAuthenticated.AccessToken != mizuki.AccessToken, "AccessToken should be updated after Authenticate")
		})

		t.Run("mizuki cannot adds another authentication without appuser authentication", func(t *testing.T) {
			a := assert.NewTestAssert(t)
			_, err = appuser.AddAuthentication(extuser.WithUser(ctx, extauth.VerifyToken(ctx, "twitter-token-mizuki")))
			a.NotNil(err)
			a.Equals(appuser.ErrAuthenticationRequired, err)
		})

		t.Run("mizuki adds another auth (apple)", func(t *testing.T) {
			a := assert.NewTestAssert(t)
			mizukiCtx := appuser.WithUser(ctx, appuser.EntUser(mizuki))
			_, err = appuser.AddAuthentication(extuser.WithUser(mizukiCtx, extauth.VerifyToken(mizukiCtx, "apple-token-mizuki")))
			a.Nil(err)
			authlist, err := appuser.ListAuthentication(mizukiCtx, mizuki.ID)
			a.Nil(err)
			a.Equals(2, len(authlist))
			a.Equals("twitter", authlist[0].ProviderName)
			a.Equals("apple", authlist[1].ProviderName)

			// now mizuki has 2 authentications with twitter and apple tokens so she can
			// update her access token by either twitter or apple token
			appleMizuki, err := appuser.Authenticate(extuser.WithUser(mizukiCtx, extauth.VerifyToken(mizukiCtx, "twitter-token-mizuki")))
			a.Nil(err)
			a.Equals(mizuki.ID, appleMizuki.ID)
			a.OK(mizuki.AccessToken != appleMizuki.AccessToken)

			twitterMizuki, err := appuser.Authenticate(extuser.WithUser(mizukiCtx, extauth.VerifyToken(mizukiCtx, "apple-token-mizuki")))
			a.Nil(err)
			a.Equals(mizuki.ID, twitterMizuki.ID)
			a.OK(mizuki.AccessToken != twitterMizuki.AccessToken)
			a.OK(appleMizuki.AccessToken != twitterMizuki.AccessToken)

			t.Run("mizuki cannot add or remove authentication with the token used by risa", func(t *testing.T) {
				// In this scenario, mizuki somehow knows the google token for risa and she tries to add it to her account.
				// It should fail since the token is already used by risa.
				a := assert.NewTestAssert(t)
				_, err = appuser.AddAuthentication(extuser.WithUser(mizukiCtx, extauth.VerifyToken(mizukiCtx, "google-token-risa")))
				a.NotNil(err, "AddAuthentication should fail since google-token-risa is used by risa.irie")
				a.Equals(appuser.ErrProviderIsAuthenticated, err)

				_, err = appuser.RemoveAuthentication(extuser.WithUser(mizukiCtx, extauth.VerifyToken(mizukiCtx, "google-token-risa")))
				a.NotNil(err, "AddAuthentication should fail since google-token-risa is used by risa.irie")
				a.Equals(appuser.ErrProviderIsAuthenticated, err)
			})

			t.Run("mizuki migrates authentication", func(t *testing.T) {
				// What mizuki can do to add google authentication to her account is to migrate the token from risa to her.
				// but it will remove the risa's user account completely since we don't want users to have multiple accounts.
				_, err = appuser.MigrateAuthentication(extuser.WithUser(mizukiCtx, extauth.VerifyToken(mizukiCtx, "google-token-risa")))
				a.Nil(err)
				authlist, err = appuser.ListAuthentication(mizukiCtx, mizuki.ID)
				a.Nil(err)
				a.OK(
					slice.ContainsFunc(authlist, func(_ int, v *ent.Auth) bool {
						return v.ProviderName == "google"
					}),
				)
				// risa's account should be removed so her token is no longer valid
				user := appuser.VerifyToken(ctx, risa.AccessToken)
				a.Nil(user)

				_, err = entutil.NewClient(ctx).User.Get(adminCtx, risa.ID)
				a.NotNil(err)
				a.OK(ent.IsNotFound(err))
			})

			t.Run("mizuki removes own authentication", func(t *testing.T) {
				// mizuki can remove her own authentication anytime.
				_, err = appuser.RemoveAuthentication(extuser.WithUser(mizukiCtx, extauth.VerifyToken(mizukiCtx, "apple-token-mizuki")))
				a.Nil(err)

				authlist, err = appuser.ListAuthentication(mizukiCtx, mizuki.ID)
				a.Nil(err)
				a.OK(
					!slice.ContainsFunc(authlist, func(_ int, v *ent.Auth) bool {
						return v.ProviderName == "apple"
					}),
				)
			})

		})

	})
}
