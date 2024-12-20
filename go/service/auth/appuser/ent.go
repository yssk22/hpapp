package appuser

import (
	"context"
	"fmt"
	"strconv"

	"github.com/yssk22/hpapp/go/service/ent"
	entuser "github.com/yssk22/hpapp/go/service/ent/user"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/system/settings"
	"github.com/yssk22/hpapp/go/system/slog"
)

func EntUser(user *ent.User) User {
	return &entUser{
		record: user,
	}
}

func ToEnt(user User) (*ent.User, error) {
	if u, ok := user.(*entUser); ok {
		return u.record, nil
	}
	return nil, fmt.Errorf("invalid user type")
}

type entUser struct {
	record *ent.User
}

func (u entUser) ID() string {
	return fmt.Sprintf("%d", u.record.ID)
}

func (u entUser) ProviderName() string {
	return "ent"
}

func (u *entUser) Username() string {
	return u.record.Username
}

func (u *entUser) IsAdmin(ctx context.Context) bool {
	adminIds := settings.GetX(ctx, SuperAdminIds)
	for _, id := range adminIds {
		if u.record.ID == id {
			return true
		}
	}
	return false
}

func (u *entUser) IsGuest(ctx context.Context) bool {
	return false
}

func VerifyToken(ctx context.Context, token string) User {
	user, err := ParseToken(ctx, token)
	if err != nil {
		slog.Warning(ctx, "cannot veirfy token by appuser",
			slog.Name("service.auth.user.entAuthenticator"),
			slog.A("token", token),
			slog.A("error", err.Error()),
		)
		return nil
	}
	userid, err := strconv.Atoi(user.ID())
	if err != nil {
		slog.Error(ctx,
			"token is valid but not a valid entid",
			slog.Name("service.auth.user.entAuthenticator"),
			slog.Attribute("user_id", user.ID()),
			slog.Attribute("error", err.Error()),
		)
		return nil
	}
	// TODO: cache userrecord
	ctx = WithUser(ctx, user)
	userrecord, err := entutil.NewClient(ctx).User.Query().Where(entuser.IDEQ(userid)).First(ctx)
	if err != nil {
		slog.Error(ctx,
			"token is valid but not a valid entid (query failed)",
			slog.Name("service.auth.user.entAuthenticator"),
			slog.Attribute("user_id", user.ID()),
			slog.Attribute("error", err.Error()),
		)
		return nil
	}
	return EntUser(userrecord)
}
