package enums

type HPFollowType string

const (
	HPFollowTypeFollowWithNotification HPFollowType = "follow_with_notification"
	HPFollowTypeFollow                 HPFollowType = "follow"
	HPFollowTypeUnfollow               HPFollowType = "unfollow"
	HPFollowTypeUnknown                HPFollowType = "unknown"
)
