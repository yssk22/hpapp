package extuser

import (
	"context"
	"encoding/json"
	"os"

	"github.com/yssk22/hpapp/go/foundation/stringutil"
	"github.com/yssk22/hpapp/go/system/slog"
)

type fileAuthenticator struct {
	path string
}

func (fa *fileAuthenticator) VerifyToken(ctx context.Context, token string) *ExternalUser {
	auth, err := LoadAuthFile(fa.path)
	if err != nil {
		slog.Error(ctx,
			"cannot load auth file",
			slog.Name("service.auth.user.fileAuthenticator"),
			slog.Attribute("filepath", fa.path),
			slog.Attribute("error", err.Error()),
		)
		return nil
	}
	if uid, ok := auth.Users[token]; ok {
		return &ExternalUser{
			ProviderName: "file",
			UserID:       uid,
			AccessToken:  token,
		}
	}
	return nil
}

type AuthFile struct {
	// token => uid mapping
	Users map[string]string `json:"users"`
}

func (f *AuthFile) AddUser() string {
	uid := stringutil.RandomString(8)
	token := stringutil.RandomString(8)
	f.Users[token] = uid
	return token
}

func (f *AuthFile) RemoveUser(token string) {
	delete(f.Users, token)
}

func (f *AuthFile) Reset() {
	f.Users = make(map[string]string)
}

func (f *AuthFile) Save(path string) error {
	jsonf, err := os.OpenFile(path, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0600)
	if err != nil {
		return err
	}
	defer jsonf.Close()
	return json.NewEncoder(jsonf).Encode(f)
}

func LoadAuthFile(path string) (*AuthFile, error) {
	f, err := os.Open(path)
	if os.IsNotExist(err) {
		return &AuthFile{
			Users: make(map[string]string),
		}, nil
	}
	if err != nil {
		return nil, err
	}
	defer f.Close()
	var af AuthFile
	if err := json.NewDecoder(f).Decode(&af); err != nil {
		return nil, err
	}
	return &af, nil
}

func NewFileAuthenticator(path string) Authenticator {
	return &fileAuthenticator{
		path: path,
	}
}
