package auth

import (
	"context"

	"hpapp.yssk22.dev/go/service/auth/appuser"
	"hpapp.yssk22.dev/go/service/auth/client"
	"hpapp.yssk22.dev/go/service/bootstrap/http/task"
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
