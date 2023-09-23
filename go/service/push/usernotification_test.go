package push

import (
	"context"
	"testing"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/object"
	"hpapp.yssk22.dev/go/service/auth/appuser"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
)

func TestNotificationSettings(t *testing.T) {
	test.New(
		"CRUD",
		test.WithHPMaster(),
		test.WithUser(),
	).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		s, err := UpsertNotificationSettings(ctx, appuser.CurrentEntUserID(ctx), "mytoken", NotificationSettings{
			Name: "myname",
			Slug: "myapp",
		})
		a.Nil(err)
		a.Equals("myname", s.Name)
		a.Equals("myapp", s.Slug)
		a.Equals("mytoken", s.Token)
		a.OK(s.EnableNewPosts)
		a.OK(s.EnablePaymentDue)
		a.OK(s.EnablePaymentStart)

		list, err := GetNotificationSettings(ctx, appuser.CurrentEntUserID(ctx), "myapp")
		a.Nil(err)
		a.Equals(1, len(list))
		a.Equals("myname", list[0].Name)
		a.Equals("myapp", list[0].Slug)
		a.Equals("mytoken", list[0].Token)
		a.OK(list[0].EnableNewPosts)
		a.OK(list[0].EnablePaymentDue)
		a.OK(list[0].EnablePaymentStart)

		// upsert with the same token string
		s, err = UpsertNotificationSettings(ctx, appuser.CurrentEntUserID(ctx), "mytoken", NotificationSettings{
			Name: "myname",
			Slug: "myapp",
		})
		a.Nil(err)
		a.Equals("myname", s.Name)
		a.Equals("myapp", s.Slug)
		a.Equals("mytoken", s.Token)
		a.OK(s.EnableNewPosts)
		a.OK(s.EnablePaymentDue)
		a.OK(s.EnablePaymentStart)

		// same slug but a diffrent token string should create a new record
		s, err = UpsertNotificationSettings(ctx, appuser.CurrentEntUserID(ctx), "mytoken2", NotificationSettings{
			Name:               "myname2",
			Slug:               "myapp",
			EnableNewPosts:     object.NullableFalse,
			EnablePaymentDue:   object.NullableFalse,
			EnablePaymentStart: object.NullableFalse,
		})
		a.Nil(err)
		a.Equals("myname2", s.Name)
		a.Equals("myapp", s.Slug)
		a.OK(!s.EnableNewPosts)
		a.OK(!s.EnablePaymentDue)
		a.OK(!s.EnablePaymentStart)

		// now the current user should have two tokens for myapp
		list, err = GetNotificationSettings(ctx, appuser.CurrentEntUserID(ctx), "myapp")
		a.Nil(err)
		a.Equals(2, len(list))
		a.Equals("myname", list[0].Name)
		a.Equals("myapp", list[0].Slug)
		a.Equals("mytoken", list[0].Token)
		a.OK(list[0].EnableNewPosts)
		a.OK(list[0].EnablePaymentDue)
		a.OK(list[0].EnablePaymentStart)
		a.Equals("myname2", list[1].Name)
		a.Equals("myapp", list[1].Slug)
		a.Equals("mytoken2", list[1].Token)
		a.OK(list[0].EnableNewPosts)
		a.OK(list[0].EnablePaymentDue)
		a.OK(list[0].EnablePaymentStart)

	})
}
