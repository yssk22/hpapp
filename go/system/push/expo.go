package push

import (
	"context"
	"strings"

	expo "github.com/nathancoleman/exponent-server-sdk-golang/sdk"
	"hpapp.yssk22.dev/go/foundation/errors"
	"hpapp.yssk22.dev/go/foundation/slice"
)

// NewExpoClient returns a Client implementation.
// If you enable Enhanced Security for Push Notifications, you have to set a valid acces token.
func NewExpoClient(ctx context.Context, accessToken string) Client {
	return &expoClient{
		client: expo.NewPushClient(&expo.ClientConfig{
			AccessToken: accessToken,
		}),
	}
}

type expoClient struct {
	client *expo.PushClient
}

func (c *expoClient) Send(ctx context.Context, m *Message) ([]string, error) {
	expoTokens, _ := slice.Filter(m.To, func(_ int, s string) (bool, error) {
		return strings.HasPrefix(s, "ExponentPushToken"), nil
	})

	expoData := make(map[string]string)
	for k, v := range m.Data {
		// take only string
		if s, ok := v.(string); ok {
			expoData[k] = s
		}
	}

	// Expo Push API LIMIT
	// https://docs.expo.dev/push-notifications/sending-notifications/
	//
	// - <600 requests per second per a project
	// - <100 messages in a request.
	// - <1000 recipients per a request.
	//
	// to take safer side, we request a message with <500 recipients
	var ids []string
	var errs []error
	chunks := slice.Chunk(expoTokens, 500)
	for _, chunk := range chunks {
		tokens, _ := slice.Map(chunk, func(_ int, v string) (expo.ExponentPushToken, error) {
			// This shouldn't return an array as we alread filter out the non expo destinations
			return expo.NewExponentPushToken(v)
		})
		res, err := c.client.Publish(&expo.PushMessage{
			To:         tokens,
			Title:      m.Title,
			Body:       m.Body,
			TTLSeconds: m.TTLSeconds,
			Priority:   string(m.Priority),
			Sound:      m.Sound,
			Badge:      m.Badge,
			Data:       expoData,
		})
		if err != nil {
			return nil, err
		}
		for _, r := range res {
			err := r.ValidateResponse()
			if err != nil {
				errs = append(errs, err)
			} else {
				ids = append(ids, r.ID)
			}
		}
	}
	return ids, errors.MultiError(errs).ToReturn()
}
