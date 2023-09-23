package auth

import (
	"context"

	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/auth/client"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/task"
)

func AllowAdmins[T any]() task.TaskOption[T] {
	return task.WithPolicy(func(ctx context.Context, _ T) task.TaskPolicy {
		if appuser.CurrentUser(ctx).IsAdmin(ctx) {
			return task.TaskPolicyAllow
		}
		if client.CurrentClient(ctx).IsAdmin(ctx) {
			return task.TaskPolicyAllow
		}
		return task.TaskPolicyDeny
	})
}
