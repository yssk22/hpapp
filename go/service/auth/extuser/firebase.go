package extuser

import (
	"context"
	"fmt"

	firebase "firebase.google.com/go/v4"
	"github.com/yssk22/hpapp/go/system/slog"
)

type firebaseAuthenticator struct {
	projectID string
}

func (fa *firebaseAuthenticator) VerifyToken(ctx context.Context, token string) *ExternalUser {
	app, err := firebase.NewApp(ctx, &firebase.Config{
		ProjectID: fa.projectID,
	})
	if err != nil {
		slog.Critical(ctx, "cannot initialize firebase app",
			slog.Name("service.auth.user.firebaseAuthenticator"),
			slog.Attribute("project_id", fa.projectID),
			slog.Attribute("error", err.Error()),
			slog.IncludeStack(),
		)
		return nil
	}
	auth, err := app.Auth(ctx)
	if err != nil {
		slog.Critical(ctx, "cannot initialize firebase app",
			slog.Name("service.auth.user.firebaseAuthenticator"),
			slog.Attribute("project_id", fa.projectID),
			slog.Attribute("error", err.Error()),
			slog.IncludeStack(),
		)
		return nil
	}
	t, err := auth.VerifyIDToken(ctx, token)
	if err != nil {
		return nil
	}
	// legacy compatibility -- we use "firebase[{providerName}]" format since
	// we used to use the 3p authentication without firebase:
	//    there are some records with "twitter.com" provider while they are not with firebase authentication and their provider user ids are different.
	providerName := fmt.Sprintf("firebase[%s]", t.Firebase.SignInProvider)
	return &ExternalUser{
		UserID:       t.UID,
		ProviderName: providerName,
		AccessToken:  token,
	}
}

func NewFirebaseAuthenticator(projectID string) Authenticator {
	return &firebaseAuthenticator{
		projectID: projectID,
	}
}
