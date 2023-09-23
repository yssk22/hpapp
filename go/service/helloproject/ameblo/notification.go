package ameblo

import (
	"context"
	"fmt"
	"time"
	"unicode/utf8"

	"github.com/yssk22/hpapp/go/foundation/stringutil"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpfeeditem"
	"github.com/yssk22/hpapp/go/service/ent/usernotificationsetting"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/push"
	"github.com/yssk22/hpapp/go/service/schema/jsonfields"
)

type amebloPostNotification struct {
	record *ent.HPAmebloPost
}

func (a *amebloPostNotification) Key() string {
	return "ameblo_post_notification"
}

func (a *amebloPostNotification) Trigger(context.Context) (string, error) {
	if a.record.MemberKey == nil {
		return "", fmt.Errorf("not a member post")
	}
	return fmt.Sprintf("path: %s, memberKey: %s", a.record.Path, *a.record.MemberKey), nil
}

func (a *amebloPostNotification) Receivers(ctx context.Context) ([]*ent.UserNotificationSetting, error) {
	memberId := a.record.OwnerMemberID
	if memberId == nil {
		return nil, nil
	}
	return push.GetFollowerNotifications(ctx, *memberId, usernotificationsetting.EnableNewPosts(true))
}

func (a *amebloPostNotification) Message(ctx context.Context) (*jsonfields.ReactNavigationPush, error) {
	memberKey := a.record.MemberKey
	body := a.record.Description
	if utf8.RuneCountInString(body) > 100 {
		body = fmt.Sprintf("%s ...", stringutil.UTF8Slice(a.record.Description, 100))
	}
	// TODO: cleanup post notification payload
	// we used to use /ameblo/post/ to show ameblo content in the native app so keep sending /ameblo/post/ along with
	// ameblo record id and feed id for backward compatibility purpose.
	params := map[string]interface{}{
		"post_id":   a.record.ID, // use id as string
		"path":      a.record.Path,
		"memberKey": *memberKey,
	}
	feed, err := entutil.NewClient(ctx).HPFeedItem.Query().Where(hpfeeditem.SourceIDEQ(a.record.ID)).First(ctx)
	if err != nil {
		return nil, fmt.Errorf("feed retrieval error: %v", err)
	}
	params["id"] = feed.ID
	return &jsonfields.ReactNavigationPush{
		PushMessage: jsonfields.ExpoPushMessage{
			Title: a.record.Title,
			Body:  body,
			Sound: "default",
		},
		Path:   "/ameblo/post/",
		Params: params,
	}, nil
}

func (a *amebloPostNotification) ExpectedDeliveryTime(context.Context) (time.Time, error) {
	return a.record.PostAt, nil
}
