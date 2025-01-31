package metrics

import (
	"fmt"
	"regexp"
	"time"

	"github.com/yssk22/hpapp/go/foundation/timeutil"
)

var (
	dateFormatRe = regexp.MustCompile(`\d{4}-\d{2}-\d{2}`)
)

func dailyDateRangeAsStr(dateStr string) (string, string) {
	// extract year, month, date from dateStr
	t, err := time.ParseInLocation("2006-01-02", dateStr, timeutil.JST)
	if err != nil {
		return "", "" // invalid date format
	}
	start := time.Date(t.Year(), t.Month(), t.Day(), 4, 0, 0, 0, timeutil.JST)
	end := start.Add(24 * time.Hour)
	return start.Format("2006-01-02"), end.Format("2006-01-02")
}

func dailyDateRangeAsTime(dateStr string) (time.Time, time.Time) {
	t, err := time.ParseInLocation("2006-01-02", dateStr, timeutil.JST)
	if err != nil {
		return time.Time{}, time.Time{} // invalid date format
	}
	start := time.Date(t.Year(), t.Month(), t.Day(), 4, 0, 0, 0, timeutil.JST)
	end := start.Add(24 * time.Hour)
	return start, end
}

type metricWindow string

const (
	metricWindowDaily   metricWindow = "daily"
	metricWindowWeekly  metricWindow = "weekly"
	metricWindowMonthly metricWindow = "monthly"
)

type metricsSpec struct {
	metricWindow         metricWindow
	metricName           string
	table                string
	ownerUserIdField     string
	dateField            string
	dateFieldIsTimestamp bool
	valueField           string
}

func buildMetricQuerySql(p metricsSpec) string {
	dateField := p.dateField
	if p.dateFieldIsTimestamp {
		dateField = fmt.Sprintf("DATE_FORMAT(DATE(CONVERT_TZ(%s, 'UTC', 'Asia/Tokyo') - INTERVAL 4 HOUR), '%%Y-%%m-%%d')", p.dateField)
	}
	// TODO: metricNameField would be `{window}.{name}.{dimention1}.{dimention2}...` style so
	//       we need to update the logic to support multiple dimentions such as hp_member_id, hp_artist_id, ...etc
	//       if we want to support multiple dimentions, we may need to generate multiple SELECT statements and UNION them.
	metricNameField := fmt.Sprintf("daily.%s", p.metricName)
	if p.ownerUserIdField != "" {
		metricNameField = fmt.Sprintf("CONCAT('daily.%s.user.', %s)", p.metricName, p.ownerUserIdField)
	}
	ownerUserIdField := "null"
	if p.ownerUserIdField != "" {
		ownerUserIdField = p.ownerUserIdField
	}
	return fmt.Sprintf(`
	SELECT 
		NOW() as created_at,
		NOW() as updated_at,
		%s AS date,
		%s AS metric_name,
		%s as owner_user_id, 
		%s AS value
	FROM hp_view_histories 
	WHERE 
		%s >= ? AND %s < ?
	GROUP BY 
		created_at, updated_at, date, metric_name, owner_user_id, value
	,2,3,4,5
`,
		dateField,                // AS date
		metricNameField,          // AS metric_name
		ownerUserIdField,         // AS owner_user_id
		p.valueField,             // AS value,
		p.dateField, p.dateField, // WHERE dateField >= ? AND dateField < ?
	)
}
