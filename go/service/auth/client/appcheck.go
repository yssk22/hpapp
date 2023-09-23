package client

import (
	"context"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/appcheck"
	"hpapp.yssk22.dev/go/foundation/slice"
	"hpapp.yssk22.dev/go/system/settings"
	"hpapp.yssk22.dev/go/system/slog"
)

type firebaseAppCheck struct {
	projectID string
}

type firebaseAppCheckClient struct {
	token *appcheck.DecodedAppCheckToken
}

func (f *firebaseAppCheckClient) ID() string {
	return f.token.AppID
}

func (f *firebaseAppCheckClient) Name() string {
	return f.token.Subject
}

func (f *firebaseAppCheckClient) IsVerified(ctx context.Context) bool {
	return true
}

func (f *firebaseAppCheckClient) IsAdmin(ctx context.Context) bool {
	adminIds := settings.GetX(ctx, SuperAdminIds)
	return slice.Contains(adminIds, f.token.AppID)
}

func (f *firebaseAppCheck) TokenHeaderKey() string {
	return "x-hpapp-client-authorization"
}

func (f *firebaseAppCheck) VerifyToken(ctx context.Context, token string) Client {
	app, err := firebase.NewApp(ctx, &firebase.Config{
		ProjectID: f.projectID,
	})
	if err != nil {
		slog.Critical(ctx, "cannot initialize firebase app",
			slog.Name("service.auth.client.firebaseAppCheck"),
			slog.Attribute("project_id", f.projectID),
			slog.Attribute("error", err.Error()),
			slog.IncludeStack(),
		)
		return nil
	}
	client, err := app.AppCheck(ctx)
	if err != nil {
		slog.Critical(ctx, "cannot initialize firebase app",
			slog.Name("service.auth.client.firebaseAppCheck"),
			slog.Attribute("project_id", f.projectID),
			slog.Attribute("error", err.Error()),
			slog.IncludeStack(),
		)
		return nil
	}
	decodedToken, err := client.VerifyToken(token)
	if err != nil {
		return nil
	}
	return &firebaseAppCheckClient{
		token: decodedToken,
	}
}

func NewFirebaseAppCheck(projectID string) Authenticator {
	return &firebaseAppCheck{
		projectID: projectID,
	}
}
