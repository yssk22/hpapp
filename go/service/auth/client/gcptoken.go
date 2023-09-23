package client

import (
	"context"
	"strings"

	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/system/settings"
	"google.golang.org/api/idtoken"
)

type gcpServiceToServiceAuth struct {
	audience string
}

type gcpServiceToServiceClient struct {
	email string
}

func (c *gcpServiceToServiceClient) ID() string {
	return c.email
}

func (c *gcpServiceToServiceClient) Name() string {
	return c.email
}

func (c *gcpServiceToServiceClient) IsVerified(ctx context.Context) bool {
	return true
}

func (c *gcpServiceToServiceClient) IsAdmin(ctx context.Context) bool {
	adminIds := settings.GetX(ctx, SuperAdminIds)
	return slice.Contains(adminIds, c.email)
}

func (a *gcpServiceToServiceAuth) TokenHeaderKey() string {
	return "authorization"
}

func (a *gcpServiceToServiceAuth) VerifyToken(ctx context.Context, token string) Client {
	token = strings.TrimPrefix(token, "Bearer ")
	payload, err := idtoken.Validate(ctx, token, a.audience)
	if err != nil {
		return nil
	}
	s, ok := payload.Claims["email"]
	if !ok {
		return nil
	}
	email, ok := s.(string)
	if !ok {
		return nil
	}
	return &gcpServiceToServiceClient{
		email: email,
	}
}

// NewGCPServiceToServiceAuth returns an Authenticator implementation that validate an OIDC token passed via "Authorization" header.
func NewGCPServiceToServiceAuth(audience string) Authenticator {
	return &gcpServiceToServiceAuth{
		audience: audience,
	}
}
