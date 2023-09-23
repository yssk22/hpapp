package client

import (
	"github.com/yssk22/hpapp/go/system/settings"
)

var (
	SuperAdminIds = settings.NewStringArray("service.auth.client.super_admin_ids", []string{})
)
