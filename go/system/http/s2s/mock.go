package s2s

import (
	"context"
)

func NewMockClient() Client {
	return &mock{}
}

// mock is an implementation of task.Client for Testing purpose
type mock struct {
	Calls []*MockCall
}

type MockCall struct {
	Key     string
	Payload []byte
	Options map[string]string
}

func (client *mock) Request(ctx context.Context, key string, payload []byte, options map[string]string) error {
	client.Calls = append(client.Calls, &MockCall{
		Key:     key,
		Payload: payload,
		Options: options,
	})
	return nil
}

func GetMockCalls(ctx context.Context) []*MockCall {
	return FromContext(ctx).(*mock).Calls
}
