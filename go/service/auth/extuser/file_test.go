package extuser

import (
	"context"
	"os"
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
)

func TestFileProvider(t *testing.T) {
	a := assert.NewTestAssert(t)
	authFilePath := "testdata/localauth.json"
	a.Nil(os.RemoveAll(authFilePath))

	instance, err := LoadAuthFile(authFilePath)
	a.Nil(err)
	token1 := instance.AddUser()
	a.Nil(instance.Save(authFilePath))
	authenticator := NewFileAuthenticator(authFilePath)
	user := authenticator.VerifyToken(context.Background(), "invalid-token")
	a.Nil(user)

	result1 := authenticator.VerifyToken(context.Background(), token1)
	a.NotNil(result1)
	a.Equals(token1, result1.AccessToken)
	a.OK(len(result1.UserID) > 0)

	token2 := instance.AddUser()
	a.Nil(instance.Save(authFilePath))

	result2 := authenticator.VerifyToken(context.Background(), token2)
	a.Nil(err)
	a.Equals(token2, result2.AccessToken)
	a.OK(len(result2.UserID) > 0)
	a.OK(result1.UserID != result2.UserID)
}
