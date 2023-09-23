package appuser

import (
	"context"
	"fmt"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/yssk22/hpapp/go/foundation/stringutil"
	"github.com/yssk22/hpapp/go/service/errors"
	"github.com/yssk22/hpapp/go/system/clock"
	"github.com/yssk22/hpapp/go/system/settings"
)

const (
	jwtProviderName = "JWT Token Provider"
)

// JWTClaims is a custom Claims for JWT
type JWTClaims struct {
	Name string `json:"username"`
	jwt.StandardClaims
}

func (c JWTClaims) ID() string {
	return c.StandardClaims.Id
}

func (c JWTClaims) ProviderName() string {
	return jwtProviderName
}

func (c JWTClaims) Username() string {
	return c.Name
}

func (c JWTClaims) IsAdmin(context.Context) bool {
	return false
}

func (c JWTClaims) IsGuest(context.Context) bool {
	return false
}

var ErrInvalidToken = errors.New("invalid token")

// IssueToken issue the JWT token string
func IssueToken(ctx context.Context, u User) (string, error) {
	now := clock.Now(ctx)
	signKey := settings.GetX(ctx, JWTSignKey)
	expiry := settings.GetX(ctx, JWTExpiry)
	expiresAt := now.Add(expiry)
	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		JWTClaims{
			Name: u.Username(),
			StandardClaims: jwt.StandardClaims{
				Id:        u.ID(),
				IssuedAt:  now.Unix(),
				Issuer:    jwtProviderName,
				ExpiresAt: expiresAt.Unix(),
				Subject:   fmt.Sprintf("%s-%s", u.ProviderName(), stringutil.RandomString(8)),
			},
		},
	)
	ss, err := token.SignedString([]byte(signKey))
	if err != nil {
		return "", errors.Wrap(ctx, err)
	}
	return ss, nil
}

func ParseToken(ctx context.Context, token string) (User, error) {
	signKey := settings.GetX(ctx, JWTSignKey)
	tok, err := jwt.ParseWithClaims(token, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(signKey), nil
	})
	if err != nil {
		return nil, ErrInvalidToken
	}
	if claims, ok := tok.Claims.(*JWTClaims); ok && tok.Valid {
		return claims, nil
	}
	return nil, ErrInvalidToken
}
