package member

import (
	"context"

	"github.com/spf13/cobra"
	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/service/auth"
	"github.com/yssk22/hpapp/go/service/bootstrap/config"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/middleware"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/task"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpartist"
	"github.com/yssk22/hpapp/go/service/ent/hpmember"
	"github.com/yssk22/hpapp/go/service/entutil"
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
