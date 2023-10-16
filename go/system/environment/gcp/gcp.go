package gcp

import (
	"context"
	"database/sql"
	"fmt"
	"net"
	"net/http"
	"os"
	"time"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/kvs"
	"github.com/yssk22/hpapp/go/system/database"
	"github.com/yssk22/hpapp/go/system/http/external"
	"github.com/yssk22/hpapp/go/system/http/s2s"
	"github.com/yssk22/hpapp/go/system/push"
	"github.com/yssk22/hpapp/go/system/settings"
	"github.com/yssk22/hpapp/go/system/slog"
	"github.com/yssk22/hpapp/go/system/storage"
	"golang.org/x/time/rate"

	gcpstorage "cloud.google.com/go/storage"
)

var (
	// list of settings used for production environment, stored in settings storage.
	mysqlInstance    = settings.NewString("system.environment.gcp.mysql_instance", "yssk22-dev:asia-northeast1:yssk22-dev-main")
	mysqlUsername    = settings.NewString("system.environment.gcp.mysql_username", "mizukifukumura")
	mysqlDatabase    = settings.NewString("system.environment.gcp.mysql_database", "main")
	mysqlPassword    = settings.NewString("system.environment.gcp.mysql_password", "19961030") // TODO: move to secret manager to make it more secure.
	mysqlIdleConns   = settings.NewInt("system.environment.gcp.mysql_idle_conns", 10)
	mysqlMaxConns    = settings.NewInt("system.environment.gcp.mysql_max_conns", 20)
	mysqlMaxLifetime = settings.NewDuration("system.mysql_max_life_time", time.Duration(1*time.Hour))

	gcpLogId          = settings.NewString("system.environment.gcp.logid", "hpapp.yssk22.dev/v3")
	gcpLocation       = settings.NewString("system.environment.gcp.location", "location")
	gcpAsyncEndpoint  = settings.NewString("system.environment.gcp.async_endpoint", "https://async.mydomain.com")
	gcpServiceAccount = settings.NewString("system.environment.gcp.service_account", "svcaccount@project.iam.gserviceaccount.com")
)

type Environment struct {
	GCPProjectID             string
	GCPDataStoreSettingsKind string

	GCPLogID          string
	GCPLocation       string
	GCPAsyncEndpoint  string
	GCPServiceAccount string

	settings kvs.KVS
	storage  storage.Storage
	db       *sql.DB
}

func NewEnvironment() *Environment {
	e := &Environment{
		GCPProjectID:             os.Getenv("HPAPP_GCP_PROJECT_ID"),
		GCPDataStoreSettingsKind: os.Getenv("HPAPP_GCP_DATASTORE_SETTINGS_KIND"),
	}
	// validate and panic if any of settings is empty.
	if e.GCPProjectID == "" {
		panic(fmt.Errorf("HPAPP_GCP_PROJECT_ID is not set"))
	}
	if e.GCPDataStoreSettingsKind == "" {
		panic(fmt.Errorf("HPAPP_GCP_DATASTORE_SETTINGS_KIND is not set"))
	}

	// now we have a basic string properties to setup resource objects.
	ctx := context.Background()
	e.settings = assert.X(settings.NewDatastore(ctx, e.GCPProjectID, settings.WithKind(e.GCPDataStoreSettingsKind)))
	e.storage = assert.X(storage.NewGCS(assert.X(gcpstorage.NewClient(ctx))))
	// we now have an access to settings storage, so bind that storage with the context to load remaining settings.
	ctx = settings.SetSettingsStore(ctx, e.settings)
	mySQLLocation := "tcp(localhost:3306)" // production service may connect to the mysql instance through the cloud sql proxy running at localhost:3306.
	if isOnGCP() {
		mySQLLocation = fmt.Sprintf(
			"unix(/cloudsql/%s)",
			settings.GetX(ctx, mysqlInstance),
		)
	}
	e.db = database.NewMySQL(
		database.WithMySQLLocation(mySQLLocation),
		database.WithMySQLDatabase(settings.GetX(ctx, mysqlDatabase)),
		database.WithMySQLUsername(settings.GetX(ctx, mysqlUsername)),
		database.WithMySQLPassword(settings.GetX(ctx, mysqlPassword)),
	)
	e.db.SetMaxIdleConns(settings.GetX(ctx, mysqlIdleConns))
	e.db.SetMaxIdleConns(settings.GetX(ctx, mysqlMaxConns))
	e.db.SetConnMaxLifetime(settings.GetX(ctx, mysqlMaxLifetime))

	e.GCPLogID = settings.GetX(ctx, gcpLogId)
	e.GCPLocation = settings.GetX(ctx, gcpLocation)
	e.GCPAsyncEndpoint = settings.GetX(ctx, gcpAsyncEndpoint)
	e.GCPServiceAccount = settings.GetX(ctx, gcpServiceAccount)

	return e
}

func (e *Environment) LogSink(ctx context.Context) slog.Sink {
	if isOnGCP() {
		gcpsink, err := slog.NewGCPSink(ctx, e.GCPProjectID, e.GCPLogID)
		if err != nil {
			return slog.NewIOSink(os.Stderr, slog.JSONFormatter)
		}
		return gcpsink
	}
	return slog.NewIOSink(os.Stderr, slog.JSONFormatter)
}

func (e *Environment) Database(ctx context.Context) *database.Info {
	return &database.Info{
		Name: "mysql",
		DB:   e.db,
	}
}

func (e *Environment) Settings(ctx context.Context) kvs.KVS {
	return e.settings
}

func (e *Environment) PushClient(ctx context.Context) push.Client {
	return push.NewExpoClient(ctx, "")
}

const (
	longTimeout               = 40 * time.Minute // large media takes much time to download
	longDialTimeout           = 45 * time.Second
	longKeepAlive             = 90 * time.Second
	longTLSHandshakeTimeout   = 10 * time.Second
	longResponseHeaderTimeout = 120 * time.Second
)

var baseHttpClient = &http.Client{
	Transport: func() *http.Transport {
		// use clone to follow the all behavior of default transport (including connection pooling)
		transport := http.DefaultTransport.(*http.Transport).Clone()
		transport.DialContext = (&net.Dialer{
			Timeout:   longDialTimeout,
			KeepAlive: longKeepAlive,
		}).DialContext
		transport.TLSHandshakeTimeout = longTLSHandshakeTimeout
		transport.ResponseHeaderTimeout = longResponseHeaderTimeout
		transport.ReadBufferSize = 65536
		return transport
	}(),
	Timeout: longTimeout,
}

func (e *Environment) HttpClient(ctx context.Context) *http.Client {
	return external.Logger(ctx,
		external.RateLimitter(ctx, baseHttpClient,
			external.DomainRateConfig{
				DomainName: "helloproject.com",
				R:          rate.Every(200 * time.Millisecond),
				B:          1,
			},
			external.DomainRateConfig{
				DomainName: "elineupmall.com",
				R:          rate.Every(200 * time.Millisecond),
				B:          1,
			},
			external.DomainRateConfig{
				DomainName: "rssblog.ameba.jp",
				R:          rate.Every(50 * time.Millisecond),
				B:          1,
			},
			external.DomainRateConfig{
				DomainName: "ameblo.jp",
				R:          rate.Every(100 * time.Millisecond),
				B:          1,
			},
			external.DomainRateConfig{
				DomainName: "stat.ameba.jp",
				R:          rate.Every(50 * time.Millisecond),
				B:          1,
			},
		),
	)
}

func (e *Environment) Storage(ctx context.Context) storage.Storage {
	return e.storage
}

func (e *Environment) S2SClient(ctx context.Context) s2s.Client {
	if isOnGCP() {
		return s2s.NewTaskQueueClient(e.GCPAsyncEndpoint, e.GCPProjectID, e.GCPLocation, "default", e.GCPServiceAccount, e.GCPProjectID)
	}
	// if the service is running out of GCP (project owners may connect to GCP resources outside GCP environment),
	// we expect S2S communication to happen in the same server via localhost:8080
	return s2s.NewLocalhost("")
}

func isOnGCP() bool {
	if isOnCloudRun() || isOnCloudFunctions() {
		return true
	}
	return false
}

func isOnCloudRun() bool {
	// Cloud Run: https://cloud.google.com/run/docs/container-contract?hl=en#services-env-vars
	return os.Getenv("K_SERVICE") != "" && os.Getenv("K_REVISION") != ""
}

func isOnCloudFunctions() bool {
	// Cloud Functions: https://cloud.google.com/functions/docs/configuring/env-var#runtime_environment_variables_set_automatically
	ftype := os.Getenv("FUNCTION_SIGNATURE_TYPE")
	return ftype == "http" || ftype == "event"
}
