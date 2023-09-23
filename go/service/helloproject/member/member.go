package member

import (
	"context"

	"github.com/spf13/cobra"
	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/slice"
	"hpapp.yssk22.dev/go/service/auth"
	"hpapp.yssk22.dev/go/service/bootstrap/config"
	"hpapp.yssk22.dev/go/service/bootstrap/http/middleware"
	"hpapp.yssk22.dev/go/service/bootstrap/http/task"
	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/ent/hpartist"
	"hpapp.yssk22.dev/go/service/ent/hpmember"
	"hpapp.yssk22.dev/go/service/entutil"
)

type memberService struct {
}

func NewMemberService() config.Service {
	return &memberService{}
}

func (*memberService) Middleware() []middleware.HttpMiddleware {
	return nil
}

func (*memberService) Tasks() []task.Task {
	return []task.Task{
		task.NewTask("/helloproject/member/crawl-artists", task.NoParameter(), CrawlArtists, auth.AllowAdmins[any]()),
	}
}

func (*memberService) Command() *cobra.Command {
	return nil
}

// GetAllArtists returns the list of artists with members. If includeOGs is false, OGs are not included and artists without members are removed.
func GetAllArtists(ctx context.Context, includeOGs bool) []*ent.HPArtist {
	client := entutil.NewClient(ctx)
	q := client.HPArtist.Query()
	q = q.Order(
		ent.Asc(hpartist.FieldIndex),
	).WithMembers(
		func(q *ent.HPMemberQuery) {
			if !includeOGs {
				q.Where(hpmember.GraduateAtIsNil())
			}
			q.Order(
				ent.Asc(hpmember.FieldJoinAt),
				ent.Asc(hpmember.FieldDateOfBirth),
			)
		},
	).WithAssets()
	// if this fails, most of logic fails so it's better to panic here.
	artists := q.AllX(ctx)
	if !includeOGs {
		// remove artists without members.
		artists = assert.X(slice.Filter(artists, func(i int, a *ent.HPArtist) (bool, error) {
			return len(a.Edges.Members) > 0, nil
		}))
	}
	return artists
}

// GetAllMembers returns the list of members. If includeOGs is false, OGs are not included.
func GetAllMembers(ctx context.Context, includeOGs bool) []*ent.HPMember {
	client := entutil.NewClient(ctx)
	q := client.HPMember.Query()
	if !includeOGs {
		q.Where(hpmember.GraduateAtIsNil())
	}
	q = q.Order(
		ent.Asc(hpmember.FieldJoinAt),
		ent.Asc(hpmember.FieldDateOfBirth),
	).WithArtist().WithAssets()
	// if this fails, most of logic fails so it's better to panic here.
	return q.AllX(ctx)
}
