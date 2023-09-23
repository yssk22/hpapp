package extuser

import (
	"context"
)

// NewMockAuthenticator provides a mock authenticator, which can be used in test cases
func NewMockAuthenticator(users ...MockUser) Authenticator {
	return &mockAuthenticator{
		users: users,
	}
}

type MockUser struct {
	ProviderName   string
	ProviderUserID string
	ValidToken     string
}

type mockAuthenticator struct {
	users []MockUser
}

func (mock *mockAuthenticator) AddUsers(ctx context.Context, users ...MockUser) {
	mock.users = append(mock.users, users...)
}

func (mock *mockAuthenticator) VerifyToken(ctx context.Context, token string) *ExternalUser {
	for _, p := range mock.users {
		if p.ValidToken == token {
			return &ExternalUser{
				ProviderName: p.ProviderName,
				UserID:       p.ProviderUserID,
				AccessToken:  token,
			}
		}
	}
	return nil
}
