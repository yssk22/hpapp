# Push Notification

This doc describe how we send push notification to the user and also covers how to test push notification with real devices.

## How we send push notification

`github.com/yssk22/hpapp/go/system/push` package provides the infrastructure for `Client` interface to deliver a `Message` object and we have a `Client` implementation on top of [Expo Push Notification API](https://docs.expo.dev/push-notifications/sending-notifications/). There is a [troubleshooting and FAQ](https://docs.expo.dev/push-notifications/faq/) for Expo Push Notification you may want to refer to.

Then `github.com/yssk22/go/hpapp/system/push` package provides a framework on top of `github.com/yssk22/go/hpapp/system/push` package and `github.com/yssk22/hpapp/go/system/push.Deliver(ctx context.Context, notif Notification, options ...DeliveryOption)` is a way for service to deliver a push notification(s).

So what the service needs to impelment is a implementation of `Notification` interface.

```
type Notification interface {
	Key() string
	Trigger(context.Context) (string, error)
	Receivers(context.Context) ([]*ent.UserNotificationSetting, error)
	Message(context.Context) (*jsonfields.ReactNavigationPush, error)
	ExpectedDeliveryTime(context.Context) (time.Time, error)
}
```

values returned by `Notification` are actually stored to ent.UserNotificationLog entity then actually pass `*Message` to the `github.com/yssk22/hpapp/go/system/push.Client` interface, which calls Expo Push Notification API.

### Why do we use ent.UserNotificationLog

as the combination of the value of `Key()` and one from `Trigger(context.Context)` is used as a unique key for the notification at database level so that we can avoid duplicate delivery of push notifications. You don't need to worry about it if you use `github.com/yssk22/hpapp/go/system/push.Deliver` function.

we also plan to use `ent.UserNotificationLog` to provide Notification history for a user.

### Example of Notificaiton

[github.com/yssk22/hpapp/go/service/hellorproject/ameblo.amebloPostNotification](https://github.com/yssk22/hpapp/blob/main/go/service/helloproject/ameblo/notification.go) is an example implementation of `Notification` from `ent.HPAmebloPost`.

### Kill Switch

Notification implementation is not such simple so you may put a bug on it. To avoid sending a wrong notification to the user, we have a kill switch mechanism.

If you want to kill notifications per their key, you can use the following command.

```
$  go run ./cmd/ --prod push kill {notification_key}
```

IF you want to kill all notifications, you can use the following command.

```
$  go run ./cmd/ --prod push kill all
```

### Expected Delivery Time

Users don't want to get notifications that are not revant to them. For example, users want to get a notification of a new Ameblo post creation, so we add a hook to send notification when HPAmebloPost ent is created. But you may sometimes create a record for old days due to backfill tasks. In such case, users don't want to get a notification for such posts. To simplify the implementation, we add `ExpectedDeliveryTime` to the `Notification` interface and `DeliveryDelayThresholdHours` (6 by default) so that we can avoid sending a notification for old posts.

`amebloPostNotification` implement as follows:

```
func (a *amebloPostNotification) ExpectedDeliveryTime(context.Context) (time.Time, error) {
	return a.record.PostAt, nil
}
```

`amebloPostNotification` will return the `PostAt` value as `ExpectedDeliveryTime` so that the notification will be sent only when it is before the time `PostAt` + `DeliveryDelayThresholdHours` hours.

## How to test push notification with devices

The service should implement the command to test the notification.

as above example, you need a Expo token from the real device to test. To get the token value, you can use the following command.

```
$  go run ./cmd/ --prod push list-tokens {userid}
```

Note that

- an user may have multiple tokens from multiple devices.
- the command is only available for prod as push service is only available in prod.
- for your test, use tokens for your self, not others.

Once you get the token, you can pass that token value to `push.Deliver()` function via `push.TestTokens()` option.

```
	log, err := push.Deliver(ctx, notif, push.TestTokens(token))
	if err != nil {
		return err
	}
	fmt.Println("sent notification - status", log.Status)
```

This sends a notification to the device with the token value and log HPUserNotificationLog entity.
