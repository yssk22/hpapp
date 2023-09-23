package extuser

import (
	"context"
	"os"
	"testing"

	"hpapp.yssk22.dev/go/foundation/assert"
)

func TestFirebaseAuthenticator(t *testing.T) {
	t.Run("valid token", func(t *testing.T) {
		token := os.Getenv("TEST_FIREBASE_ID_TOKEN")
		projectID := os.Getenv("TEST_FIREBASE_PROJECTID")
		if token == "" || projectID == "" {
			t.Skipf("this test requires TEST_FIREBASE_ID_TOKEN and TEST_FIREBASE_PROJECTID in environment variable")
			return
		}
		a := assert.NewTestAssert(t)
		p := &firebaseAuthenticator{
			projectID: projectID,
		}
		user := p.VerifyToken(context.Background(), token)
		a.NotNil(user)
	})

	t.Run("invalid token", func(t *testing.T) {
		projectID := os.Getenv("TEST_FIREBASE_PROJECTID")
		if projectID == "" {
			t.Skipf("this test requires TEST_FIREBASE_PROJECTID in environment variable")
			return
		}
		a := assert.NewTestAssert(t)
		p := &firebaseAuthenticator{
			projectID: "",
		}
		user := p.VerifyToken(context.Background(), "this token should not be a valid")
		a.Nil(user)
	})
}
