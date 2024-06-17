/*
Packate test provides a test framework and runner for the service package.

# Using external resources in service test implementation

In the test implementation under the service directory, you can implement integration tests using external resources (databases, log output streams, configuration KVS, etc.)

	import (
		"testing"
		"github.com/yssk22/hpapp/goservice/test"
	)

	func TestServiceIntegration(t *testing.T) {
	    test.New("my test").Run(t, func(ctx context.Context, t *testing.T) {
	        // ....
		})
	}

In the above example, the `test.New("my test")` function creates a test environment with external resources and the `Run` method executes the test code with those resources.
Each of test.New("my test") instances has its own unique external resources, so the database records created in one test case do not affect other test cases.

In addition, the `HPArtist`, `HPAsset`, and `HPMember` entities can be automatically set up in the database on a test case basis by adding `WithHPMaster` to the test case.
The data is created based on the `go/data/\*.csv` in the repository.

	func TestServiceIntegration(t *testing.T) {
	    test.New("my test", test.WithMaster()).Run(t, func(ctx context.Context, t *testing.T) {
	        // ....
	        // entclient := entutil.NewClient(ctx)
	        // entclient.HPArtist.Query().All(ctx) --> returns record imported from go/data/hp_artists.csv
		})
	}
*/
package test

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"sync"
	"testing"
	"time"

	"entgo.io/ent/dialect/sql/schema"
	"github.com/yssk22/hpapp/go/foundation/timeutil"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/auth/client"
	"github.com/yssk22/hpapp/go/service/ent"
	_ "github.com/yssk22/hpapp/go/service/ent/runtime"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/system/clock"
	ccontext "github.com/yssk22/hpapp/go/system/context"
	"github.com/yssk22/hpapp/go/system/database"
	"github.com/yssk22/hpapp/go/system/environment"
	"github.com/yssk22/hpapp/go/system/environment/gotest"
	"github.com/yssk22/hpapp/go/system/settings"
	"github.com/yssk22/hpapp/go/system/slog"
)

type Runner interface {
	Run(*testing.T, func(ctx context.Context, t *testing.T))
}

type Option func(*testRunner)

func WithHPMaster() Option {
	return func(t *testRunner) {
		t.WithHPMaster = true
	}
}

func WithAdmin() Option {
	return func(t *testRunner) {
		t.WithAdmin = true
	}
}

func WithUser() Option {
	return func(t *testRunner) {
		t.WithUser = true
	}
}

func WithUnverifiedClient() Option {
	return func(t *testRunner) {
		t.WithUnverifiedClient = true
	}
}

// WithContextTime sets the clock.ContextTime() by `t` at the beginning of the test.
func WithContextTime(t time.Time) Option {
	return func(r *testRunner) {
		r.ContextTime = t
	}
}

// WithNow sets clock.Now() by `t` at the beginning of the test.
func WithNow(t time.Time) Option {
	return func(r *testRunner) {
		r.Now = t
	}
}

// WithFixedTimestamp is a shorthand for WithContextTime(t) and WithNow(t), where t is 2020-10-30T00:00:00+09:00.
func WithFixedTimestamp() Option {
	t := time.Date(2020, 10, 30, 0, 0, 0, 0, timeutil.JST)
	return func(r *testRunner) {
		WithContextTime(t)(r)
		WithNow(t)(r)
	}
}

type testRunner struct {
	Name                 string
	WithHPMaster         bool
	WithUser             bool
	WithAdmin            bool
	WithUnverifiedClient bool
	ContextTime          time.Time
	Now                  time.Time
}

func (r *testRunner) Run(t *testing.T, f func(ctx context.Context, t *testing.T)) {
	_, path, line, _ := runtime.Caller(1)
	testID := fmt.Sprintf("%s:%d", path, line)
	t.Run(r.Name, func(t *testing.T) {
		ctx := context.Background()
		e := gotest.NewEnvironment(testID)
		ctx = environment.WithContext(ctx, e, ccontext.ID(testID), ccontext.Timestamp(r.ContextTime))
		ctx = appuser.WithUser(ctx, appuser.Guest())
		defer func() {
			db := database.FromContext(ctx)
			db.DB.Close()
		}()
		entclient := entutil.NewClient(ctx)
		slog.PanicIfError(
			ctx,
			"bootstrap.environment.devcontainer.OnStart",
			entclient.Schema.Create(
				ctx,
				schema.WithDropIndex(true),
				schema.WithDropColumn(true),
				schema.WithGlobalUniqueID(true),
			),
		)
		if r.WithHPMaster {
			slog.PanicIfError(ctx, "service.bootstrap.test.import_hp_master", r.importHPMaster(ctx))
		}
		if r.WithAdmin && r.WithUser {
			panic("do not set both WithAdmin and WitUser")
		}
		if r.WithAdmin {
			ctx = r.setupUser(ctx, true)
		} else if r.WithUser {
			ctx = r.setupUser(ctx, false)
		}
		if r.WithUnverifiedClient {
			ctx = client.WithClient(ctx, client.Anonymous())
		} else {
			ctx = client.WithClient(ctx, client.SuperAdmin())
		}
		if !r.Now.IsZero() {
			ctx = clock.SetNow(ctx, r.Now)
		}
		f(ctx, t)
	})
}

func (r *testRunner) importHPMaster(ctx context.Context) error {
	if err := r.importHPMasterTable(ctx, "hp_artists"); err != nil {
		return err
	}
	if err := r.importHPMasterTable(ctx, "hp_members"); err != nil {
		return err
	}
	if err := r.importHPMasterTable(ctx, "hp_assets"); err != nil {
		return err
	}
	if err := r.importHPMasterTable(ctx, "hp_member_assets"); err != nil {
		return err
	}
	return nil
}

func (r *testRunner) importHPMasterTable(ctx context.Context, table string) error {
	baseDir := os.Getenv("HPMASTER_DATA_DIR")
	if baseDir == "" {
		baseDir = "."
	}
	filePath, err := entutil.FindExportFile(ctx, baseDir, filepath.Join("data", fmt.Sprintf("%s.csv", table)))
	if err != nil {
		// retry with using the current file path. This doesn't work outside the repostiory
		// but should work if the project clones the OSS repository in their working environment.
		if err == entutil.ErrExportFileNotFound {
			_, file, _, _ := runtime.Caller(0)
			baseDir = filepath.Dir(file)
			filePath, err = entutil.FindExportFile(ctx, baseDir, filepath.Join("data", fmt.Sprintf("%s.csv", table)))
		}
	}
	if err != nil {
		return fmt.Errorf("cannot open the export file for table `%s` (env.HPMASTER_DATA_DIR=%q): %w", table, os.Getenv("HPMASTER_DATA_DIR"), err)
	}
	fr, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("cannot open the export file at %s: %w", filePath, err)
	}
	defer fr.Close()
	if err := entutil.ImportTable(ctx, fr, table); err != nil {
		return fmt.Errorf("cannot import the export file from %s: %w", filePath, err)
	}
	return nil
}

func (r *testRunner) setupUser(ctx context.Context, isAdmin bool) context.Context {
	u := MakeTestUser(ctx)
	ctx = appuser.WithUser(ctx, u)
	if isAdmin {
		intID, err := strconv.Atoi(u.ID())
		if err != nil {
			panic(err)
		}
		err = settings.Set(ctx, appuser.SuperAdminIds, []int{intID})
		if err != nil {
			panic(err)
		}
	}
	return ctx
}

func New(name string, options ...Option) Runner {
	r := &testRunner{
		Name:         name,
		WithHPMaster: false,
		ContextTime:  time.Now(), //nolint:gocritic // clock.Now() is not available yet as it's in bootstrap.
		Now:          time.Time{},
	}
	for _, option := range options {
		option(r)
	}
	return r
}

// MakeTestUser creates a test user.
func MakeTestUser(ctx context.Context) appuser.User {
	return appuser.EntUser(userGenerator.Generate(ctx))
}

const TestUserName = "test_user"

type testUserGenerator struct {
	m   sync.Mutex
	seq int
}

func (g *testUserGenerator) Generate(ctx context.Context) *ent.User {
	g.m.Lock()
	defer g.m.Unlock()
	g.seq = g.seq + 1
	return entutil.NewClient(ctx).User.Create().
		SetUsername(fmt.Sprintf("%s%d", TestUserName, g.seq)).
		SetAccessToken(fmt.Sprintf("test_user_token%d", g.seq)).
		SaveX(ctx)
}

var userGenerator = &testUserGenerator{}
