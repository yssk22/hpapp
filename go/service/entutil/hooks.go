package entutil

import (
	"context"
	"fmt"

	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/system/slog"
)

var runtimeHooks []func(ent.Mutator) ent.Mutator

func AddPostMutationHook[T any](hook func(ctx context.Context, v T) error) {
	runtimeHooks = append(runtimeHooks, func(next ent.Mutator) ent.Mutator {
		return ent.MutateFunc(func(ctx context.Context, m ent.Mutation) (ent.Value, error) {
			v, err := next.Mutate(ctx, m)
			if err != nil {
				return v, err
			}
			entvalue, ok := v.(T)
			if ok {
				err2 := hook(ctx, entvalue)
				if err2 != nil {
					slog.Warning(ctx, fmt.Sprintf("[%s] failed to run post mutation hook", m.Type()),
						slog.Name("service.entutil.post_mutation_hook_error"),
						slog.Attribute("ent_type", m.Type()),
						slog.IncludeStack(),
					)
				}
			}
			return v, err
		})
	})
}
