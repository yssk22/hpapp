package metrics

var userMetricSpecs = map[string]metricsSpec{
	"view_count": {
		metricWindow:         metricWindowDaily,
		metricName:           "view_count",
		table:                "hp_view_histories",
		ownerUserIdField:     "user_hpview_history",
		dateField:            "created_at",
		dateFieldIsTimestamp: true,
		valueField:           "COUNT(*)",
	},
}
