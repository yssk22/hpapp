package appuser

import (
	"context"
	"fmt"
	"time"

	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/user"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/system/settings"
	"github.com/yssk22/hpapp/go/system/slog"
)

var (
	JWTSignKey = settings.NewString("service.auth.appuser.jwt_sign_key", "mizuki.fukumura.19961030")
	JWTExpiry  = settings.NewDuration("service.auth.appuser.jwt_expiry", time.Duration(30*24*time.Hour))

	SuperAdminIds = settings.NewIntArray("service.auth.appuser.super_admin_ids", []int{})
)

// GetSuperAdmnToken returns an access token of one of super admin users. This is used for internal API calls.
func GetSuperAdminToken(ctx context.Context) (string, error) {
	currentUser := CurrentUser(ctx)
	if !currentUser.IsAdmin(ctx) {
		return "", fmt.Errorf("non admin user can use super admin token")
	}
	adminIds := settings.GetX(ctx, SuperAdminIds)
	if len(adminIds) > 0 {
		userrecord, err := entutil.NewClient(ctx).User.Query().Where(user.IDEQ(adminIds[0])).First(ctx)
		if err != nil {
			if ent.IsNotFound(err) {
				return "", fmt.Errorf("inavlid appuser.SuperAdminIds configuration: %v", err)
			}
			return "", err
		}
		slog.Info(ctx, "super admin token is used",
			slog.Name("service.auth.appuser.GetSuperAdminToken"),
			slog.Attribute("by_id", currentUser.ID()),
			slog.Attribute("by_name", currentUser.Username()),
		)
		return userrecord.AccessToken, nil
	}
	return "", fmt.Errorf("no super admin configuration")
}
