package client

import (
	"hpapp.yssk22.dev/go/system/settings"
)

var (
	SuperAdminIds = settings.NewStringArray("service.auth.client.super_admin_ids", []string{})
)
