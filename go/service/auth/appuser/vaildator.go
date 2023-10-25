package appuser

import (
	"context"

	"github.com/yssk22/hpapp/go/service/errors"
)

type authValidator struct {
	required      bool
	adminRequired bool
	matchIds      []string
	or            interface{}
}

type ValidatorOption func(*authValidator)

func Required() ValidatorOption {
	return func(v *authValidator) {
		v.required = true
	}
}

func AdminRequired() ValidatorOption {
	return func(v *authValidator) {
		v.adminRequired = true
	}
}

func MatchIDs(ids ...string) ValidatorOption {
	return func(v *authValidator) {
		v.matchIds = ids
	}
}

func Or(options ...ValidatorOption) ValidatorOption {
	return func(v *authValidator) {
		fallback := &authValidator{}
		for _, opt := range options {
			opt(fallback)
		}
		v.or = fallback
	}
}

func (v *authValidator) validate(ctx context.Context, user User) (User, error) {
	if v.required && user.IsGuest(ctx) {
		if v.or != nil {
			return v.or.(*authValidator).validate(ctx, user)
		}
		return nil, ErrAuthenticationRequired
	}

	if v.adminRequired && !user.IsAdmin(ctx) {
		if v.or != nil {
			return v.or.(*authValidator).validate(ctx, user)
		}
		return nil, ErrAdminAuthenticationRequired
	}

	if len(v.matchIds) > 0 {
		match := false
		for _, id := range v.matchIds {
			if user.ID() == id {
				match = true
				break
			}
		}
		if !match {
			if v.or != nil {
				return v.or.(*authValidator).validate(ctx, user)
			}
			return nil, ErrNotAuthorized
		}
	}
	return user, nil
}

var (
	ErrExtUserNotAuthenticated     = errors.New("extuser authentication is required")
	ErrAuthenticationRequired      = errors.New("user authentication is required")
	ErrAdminAuthenticationRequired = errors.New("admin authentication is required")
	ErrNotAuthorized               = errors.New("not authorized")
	ErrNotNormalUser               = errors.New("not a normal user")
)

func Validate(ctx context.Context, options ...ValidatorOption) (User, error) {
	v := &authValidator{}
	for _, option := range options {
		option(v)
	}

	user := CurrentUser(ctx)
	return v.validate(ctx, user)
}
