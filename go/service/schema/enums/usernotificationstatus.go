package enums

type UserNotificationStatus string

const (
	UserNotificationStatusPrepared UserNotificationStatus = "prepared"
	UserNotificationStatusSent     UserNotificationStatus = "sent"
	UserNotificationStatusError    UserNotificationStatus = "error"
)
