package appuser

import (
	"context"
	"fmt"
	"strconv"

	"github.com/yssk22/hpapp/go/foundation/stringutil"
	"github.com/yssk22/hpapp/go/service/auth/extuser"
	"github.com/yssk22/hpapp/go/service/ent"
	entauth "github.com/yssk22/hpapp/go/service/ent/auth"
	entuser "github.com/yssk22/hpapp/go/service/ent/user"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/errors"
	"github.com/yssk22/hpapp/go/system/slog"
)

func DeleteUser(ctx context.Context, id string) error {
	_, err := Validate(ctx, MatchIDs(id), Or(AdminRequired()))
	if err != nil {
		return err
	}
	uid, err := strconv.Atoi(id)
	if err != nil {
		return errors.Wrap(ctx, err)
	}
	client, err := entutil.NewClient(ctx).Tx(ctx)
	if err != nil {
		return errors.Wrap(ctx, err)
	}
	return entutil.RunTxOne(ctx, func(tx *ent.Tx) error {
		_, err = client.Auth.Delete().Where(entauth.HasUserWith(entuser.IDEQ(uid))).Exec(ctx)
		if err != nil {
			return errors.Wrap(ctx, err)
		}
		err = client.User.DeleteOneID(uid).Exec(ctx)
		if err != nil {
			return errors.Wrap(ctx, err)
		}
		return nil
	})
}

func AddAuthentication(ctx context.Context) (*ent.Auth, error) {
	entuser, err := CurrentEntUser(ctx)
	if err != nil {
		return nil, err
	}
	euser := extuser.CurrentUser(ctx)
	if euser == nil {
		return nil, ErrExtUserNotAuthenticated
	}
	client := entutil.NewClient(ctx)

	// we check all auth record so need to do sudo here
	adminCtx := WithAdmin(ctx)
	authrecord, err := client.Auth.Query().WithUser().Where(entauth.And(
		entauth.ProviderNameEQ(euser.ProviderName),
		entauth.ProviderUserIDEQ(euser.UserID),
	)).First(adminCtx)
	if err := ent.MaskNotFound(err); err != nil {
		return nil, errors.Wrap(ctx, err)
	}
	if authrecord != nil {
		if authrecord.Edges.User.ID == entuser.ID {
			return authrecord, nil
		}
		return nil, ErrProviderIsAuthenticated
	}
	created, err := createAuthRecord(adminCtx, client.Auth, entuser, euser)
	if err != nil {
		return nil, errors.Wrap(ctx, err)
	}
	return created, nil
}

func ListAuthentication(ctx context.Context, userid int) ([]*ent.Auth, error) {
	userrecord, err := CurrentEntUser(ctx)
	if err != nil {
		return nil, err
	}
	list, err := entutil.NewClient(ctx).Auth.Query().Where(entauth.HasUserWith(entuser.IDEQ(userrecord.ID))).Order(ent.Asc(entauth.FieldCreatedAt)).All(ctx)
	if err != nil {
		return nil, errors.Wrap(ctx, err)
	}
	return list, nil
}

var (
	ErrNoAuthRecordFound = errors.New("no auth record found")
	ErrOrphanAuthRecord  = errors.New("orphan auth record")
)

func RemoveAuthentication(ctx context.Context) (*ent.Auth, error) {
	userrecord, err := CurrentEntUser(ctx)
	if err != nil {
		return nil, err
	}
	euser := extuser.CurrentUser(ctx)
	if euser == nil {
		return nil, ErrExtUserNotAuthenticated
	}
	adminCtx := WithAdmin(ctx)
	authrecord, err := getAuthRecordByExternalAuthResult(adminCtx, euser)
	if err := ent.MaskNotFound(err); err != nil {
		return nil, errors.Wrap(ctx, err)
	}
	if authrecord == nil {
		return nil, ErrNoAuthRecordFound
	}
	if authrecord.Edges.User == nil {
		return nil, errors.Wrap(ctx, fmt.Errorf("orphan auth record %d", authrecord.ID))
	}
	if authrecord.Edges.User.ID != userrecord.ID {
		return nil, ErrProviderIsAuthenticated
	}
	err = entutil.NewClient(ctx).Auth.DeleteOne(authrecord).Exec(ctx)
	if err != nil {
		return nil, errors.Wrap(ctx, err)
	}
	return authrecord, nil
}

var (
	ErrNoAuthMigrationRequired = errors.New("no auth migration required")
)

func MigrateAuthentication(ctx context.Context) (*ent.Auth, error) {
	userrecord, err := CurrentEntUser(ctx)
	if err != nil {
		return nil, err
	}
	extuser := extuser.CurrentUser(ctx)
	if extuser == nil {
		return nil, ErrExtUserNotAuthenticated
	}
	adminCtx := WithAdmin(ctx)
	authrecord, err := getAuthRecordByExternalAuthResult(adminCtx, extuser)
	if err := ent.MaskNotFound(err); err != nil {
		return nil, errors.Wrap(ctx, err)
	}
	if authrecord == nil {
		return nil, errors.Wrap(ctx, err)
	}
	if authrecord.Edges.User == nil {
		return nil, errors.Wrap(ctx, fmt.Errorf("orphan auth record %d", authrecord.ID))
	}
	if authrecord.Edges.User.ID == userrecord.ID {
		return nil, ErrNoAuthMigrationRequired
	}
	olduser := authrecord.Edges.User
	return entutil.RunTx(adminCtx, func(tx *ent.Tx) (*ent.Auth, error) {
		if err := tx.Auth.DeleteOne(authrecord).Exec(ctx); err != nil {
			return nil, errors.Wrap(ctx, err)
		}
		// old user account can be removed if it's orphaned
		numAuths, err := tx.Auth.Query().Where(entauth.HasUserWith(entuser.ID(olduser.ID))).Count(ctx)
		if err != nil {
			return nil, errors.Wrap(ctx, err)
		}
		if numAuths == 0 {
			err := tx.User.DeleteOne(olduser).Exec(ctx)
			if err != nil {
				return nil, errors.Wrap(ctx, err)
			}
			slog.Info(ctx,
				fmt.Sprintf("an orphaned user %d was deleted as a result of the authentication migration", olduser.ID),
				slog.Name("services.user.auth.migrate_auth.remove_orphan_user"),
				slog.Attribute("from", olduser.ID),
				slog.Attribute("to", userrecord.ID),
			)
		}

		created, err := createAuthRecord(ctx, tx.Auth, userrecord, extuser)
		if err != nil {
			return nil, errors.Wrap(ctx, err)
		}
		slog.Info(ctx, fmt.Sprintf("auth record (%d) has been migrated successfully", created.ID),
			slog.Name("services.user.auth.migrate"),
			slog.Attribute("from", olduser.ID),
			slog.Attribute("to", userrecord.ID),
		)
		return created, nil
	})
}

// Authenticate authenticate the user with the external provider and refresh the user's access token
// if it's a first authentication access, then this will create a user account with the random username
func Authenticate(ctx context.Context) (*ent.User, error) {
	// authenticate with the external provider, then refresh the access token for the user to use
	euser := extuser.CurrentUser(ctx)
	if euser == nil {
		return nil, ErrExtUserNotAuthenticated
	}
	adminCtx := WithAdmin(ctx)
	authRecord, err := getAuthRecordByExternalAuthResult(adminCtx, euser)
	if err != nil {
		return nil, errors.Wrap(ctx, err)
	}
	if authRecord == nil {
		user, err := createUserRecord(adminCtx, generateUsername(), euser)
		if err != nil {
			return nil, errors.Wrap(ctx, err)
		}
		return user, nil
	}
	if authRecord.Edges.User == nil {
		return nil, errors.Wrap(ctx, fmt.Errorf("Auth record (%d) doesn't have have a parent user record", authRecord.ID))
	}
	userrecord, err := refreshUserToken(ctx, authRecord.Edges.User)
	if err != nil {
		return nil, errors.Wrap(ctx, fmt.Errorf("cannot refresh the user token for user %d: %w", authRecord.Edges.User.ID, err))
	}
	return userrecord, nil
}

func getAuthRecordByExternalAuthResult(ctx context.Context, euser *extuser.ExternalUser) (*ent.Auth, error) {
	client := entutil.NewClient(ctx)
	record, err := client.Auth.Query().WithUser().Where(entauth.And(
		entauth.ProviderNameEQ(euser.ProviderName),
		entauth.ProviderUserIDEQ(euser.UserID),
	)).First(ctx)
	if err := ent.MaskNotFound(err); err != nil {
		return nil, err
	}
	if record != nil {
		return record, nil
	}
	// if there is no auth record, let's create it
	// provider name has been change from "firebase" to "[firebase]{servicename}" so try to find auth record only by UserID as a fallback.
	record, err = client.Auth.Query().WithUser().Where(entauth.And(
		entauth.ProviderUserIDEQ(euser.UserID),
	)).First(ctx)
	if err := ent.MaskNotFound(err); err != nil {
		return nil, err
	}
	if record == nil {
		return nil, nil
	}
	// the record should have the different provider name, so let's update it
	updated, err := record.Update().SetProviderName(euser.ProviderName).Save(ctx)
	if err != nil {
		return nil, err
	}
	updated.Edges = record.Edges
	slog.Info(ctx, "auth provider name record has been updated",
		slog.Name("service.auth.appuser.update_provider_name"),
		slog.Attribute("auth_id", record.ID),
	)
	return updated, nil
}

var (
	ErrUsernameIsTooShort      = errors.New("username must be at least 3 characters long")
	ErrUsernameIsTooLong       = errors.New("username must not be longer than 32 characters")
	ErrUsernameIsInvalid       = errors.New("username must start with a-z or A-Z and contains only alphabet, digist, -, _, or .")
	ErrUsernameIsTaken         = errors.New("username is already taken")
	ErrProviderIsAuthenticated = errors.New("another user already authenticated with the provider")
)

// validateUsername validates the username
//
//  1. it must start with a-z or A-Z
//  2. it can include a-z, A-Z, 0-9, -, _, or .
//  3. it must be at least 3 characters long
//  4. it must not be longer than 32 characters
//  5. it must not be already taken by another user
//
// this func was used before to validate the username from user inputs, but now we generate username automatically on server side so
// we technicall don't need this func but keep it as is for future use when we introduce the user profile feature
func validateUsername(ctx context.Context, username string) error { // nolint:unused // intentionally keep this function for the future reference.
	if len(username) < 3 {
		return ErrUsernameIsTooShort
	}
	if len(username) > 32 {
		return ErrUsernameIsTooLong
	}
	if username[0] < 'a' || username[0] > 'z' {
		if username[0] < 'A' || username[0] > 'Z' {
			return ErrUsernameIsInvalid
		}
	}
	for _, c := range username {
		if c >= 'a' && c <= 'z' {
			continue
		}
		if c >= 'A' && c <= 'Z' {
			continue
		}
		if c >= '0' && c <= '9' {
			continue
		}
		if c == '-' || c == '_' || c == '.' {
			continue
		}
		return ErrUsernameIsInvalid
	}
	_, err := entutil.NewClient(ctx).User.Query().Where(entuser.UsernameEQ(username)).First(ctx)
	if err == nil {
		return ErrUsernameIsTaken
	}
	if !ent.IsNotFound(err) {
		return errors.Wrap(ctx, err)
	}
	return nil
}

func generateUsername() string {
	first := stringutil.RandomStringWith(1, []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"))
	other := stringutil.RandomStringWith(15, []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"))
	return fmt.Sprintf("%s%s", first, other)
}

func createUserRecord(ctx context.Context, username string, euser *extuser.ExternalUser) (*ent.User, error) {
	return entutil.RunTx(ctx, func(tx *ent.Tx) (*ent.User, error) {
		authrecord, err := tx.Auth.Query().Where(entauth.ProviderNameEQ(euser.ProviderName), entauth.ProviderUserIDEQ(euser.UserID)).First(ctx)
		if err = ent.MaskNotFound(err); err != nil {
			return nil, errors.Wrap(ctx, err)
		}
		if authrecord != nil {
			return nil, ErrProviderIsAuthenticated
		}
		userrecord, err := tx.User.Create().SetUsername(username).SetAccessToken(username).Save(ctx)
		if err != nil {
			return nil, errors.Wrap(ctx, err)
		}
		_, err = createAuthRecord(ctx, tx.Auth, userrecord, euser)
		if err != nil {
			return nil, errors.Wrap(ctx, err)
		}
		userrecord, err = refreshUserToken(ctx, userrecord)
		if err != nil {
			return nil, errors.Wrap(ctx, err)
		}
		slog.Info(
			ctx,
			fmt.Sprintf("a new user %s (%d) is created with %s (provider user id:%s)", userrecord.Username, userrecord.ID, euser.ProviderName, euser.UserID),
			slog.Name("service.auth.appuser.createUserRecord"),
		)
		return userrecord, nil
	})
}

func createAuthRecord(ctx context.Context, authclient *ent.AuthClient, userrecord *ent.User, euser *extuser.ExternalUser) (*ent.Auth, error) {
	return authclient.Create().
		SetProviderName(euser.ProviderName).
		SetProviderUserID(euser.UserID).
		SetExpireAt(euser.TokenExpireAt).
		SetUser(userrecord).
		// #125: we don't use access token and refresh token anymore
		SetAccessToken(euser.UserID).
		SetRefreshToken(euser.UserID).
		Save(ctx)
}

func refreshUserToken(ctx context.Context, userrecord *ent.User) (*ent.User, error) {
	newToken, err := IssueToken(ctx, EntUser(userrecord))
	if err != nil {
		return nil, err
	}
	slog.Info(ctx, "a user token has been refreshed",
		slog.Name("service.auth.appuser.refreshUserToken"),
		slog.Attribute("user_id", userrecord.ID),
	)
	// #125: we don't store access token on the database but use it for client accesses
	userrecord.AccessToken = newToken
	return userrecord, nil
}
