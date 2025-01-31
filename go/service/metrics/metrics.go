package metrics

import (
	"context"
	"fmt"

	"github.com/spf13/cobra"
	"github.com/yssk22/hpapp/go/foundation/timeutil"
	"github.com/yssk22/hpapp/go/service/auth"
	"github.com/yssk22/hpapp/go/service/auth/appuser"
	"github.com/yssk22/hpapp/go/service/bootstrap/config"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/middleware"
	"github.com/yssk22/hpapp/go/service/bootstrap/http/task"
	"github.com/yssk22/hpapp/go/system/clock"
	"github.com/yssk22/hpapp/go/system/database"
)

type metricsService struct {
}

// Middleware implements config.Service.
func (m *metricsService) Middleware() []middleware.HttpMiddleware {
	return nil
}

// Command implements config.Service.
func (m *metricsService) Command() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "metrics",
		Short: "metrics commands",
	}
	cmd.AddCommand(m.dailyUserMetricsCommand())
	return cmd
}

// Tasks implements config.Service.
func (m *metricsService) Tasks() []task.Task {
	return []task.Task{}
}

func NewService() config.Service {
	return &metricsService{}
}

func (s *metricsService) dailyUserMetricsCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "user-daily",
		Short: "Update daily user metrics",
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := appuser.WithAdmin(cmd.Context())
			// flag
			// dryRun, _ := cmd.Flags().GetBool("dry-run")
			dateStr, _ := cmd.Flags().GetString("date")
			update, _ := cmd.Flags().GetBool("update")
			return s.dailyUserMetrics(ctx, DailyUserMetricsRequestParams{
				Date:   dateStr,
				DryRun: !update,
			})
		},
	}
	// flag --date or -d
	cmd.Flags().StringP("date", "d", "", "Specify the date for the metrics in YYYY-MM-DD format")
	// flag --dru-run
	cmd.Flags().Bool("update", false, "Update the records")
	return cmd
}

type DailyUserMetricsRequestParams struct {
	Date   string `json:"date"` // YYYY-MM-DD
	DryRun bool   `json:"dryRun"`
}

func (s *metricsService) DailyUserMetricsTask() *task.TaskSpec[DailyUserMetricsRequestParams] {
	return task.NewTask[DailyUserMetricsRequestParams](
		"/metrics/daily",
		&task.JSONParameter[DailyUserMetricsRequestParams]{},
		s.dailyUserMetrics,
		auth.AllowAdmins[DailyUserMetricsRequestParams](),
	)
}

func (s *metricsService) dailyUserMetrics(ctx context.Context, params DailyUserMetricsRequestParams) error {
	if params.Date == "" {
		// by default, yesterday
		params.Date = clock.Now(ctx).AddDate(0, 0, -1).In(timeutil.JST).Format("2006-01-02")
	}
	db := database.FromContext(ctx).DB
	start, end := dailyDateRangeAsTime(params.Date)
	targetTable := "metrics"
	if params.DryRun {
		targetTable = "metric_dry_runs"
	}

	for _, userMetricSpec := range userMetricSpecs {
		// build Query
		selectQuery := buildMetricQuerySql(userMetricSpec)
		sql := fmt.Sprintf(`
INSERT INTO %s (created_at, updated_at, date, metric_name, owner_user_id, value)
%s
ON DUPLICATE KEY UPDATE 
	value = VALUES(value),
	updated_at = NOW()
;`, targetTable, selectQuery)
		_, err := db.QueryContext(ctx, sql, start, end)
		if err != nil {
			// fmt.Println(sql)
			return err
		}
	}
	return nil
}
