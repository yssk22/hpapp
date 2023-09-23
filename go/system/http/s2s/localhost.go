package s2s

import (
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
)

// NewLocalhost returns a new Client that sends a http request to the localhost:8080
func NewLocalhost(authorization string) Client {
	return &localhost{
		authorization: authorization,
	}
}

type localhost struct {
	authorization string
}

func (client *localhost) Request(ctx context.Context, key string, payload []byte, options map[string]string) error {
	url := fmt.Sprintf("http://localhost:8080%s", key)
	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(payload))
	if err != nil {
		return fmt.Errorf("http request failed: %w", err)
	}
	authorization := client.authorization
	if options != nil {
		if s, ok := options["authorization"]; ok {
			authorization = s
		}
	}
	req.Header = getHttpHeaderFromOptions(options)
	if authorization != "" && req.Header.Get("Authorization") == "" {
		req.Header.Set("Authorization", authorization)
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("http request failed: %w", err)
	}
	defer resp.Body.Close()
	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	if resp.StatusCode != 200 {
		return fmt.Errorf("unsuccessfull status code %d: %s", resp.StatusCode, string(respBody))
	}
	return nil
}
