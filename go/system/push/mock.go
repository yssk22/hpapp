package push

import (
	"context"
	"fmt"
)

func NewMockClient(context.Context) Client {
	return &mockClient{}
}

type mockClient struct {
	sent []*Message
}

func (c *mockClient) Send(ctx context.Context, m *Message) ([]string, error) {
	c.sent = append(c.sent, m)
	return []string{fmt.Sprintf("%d", len(c.sent)-1)}, nil
}

func GetMockSentMessages(ctx context.Context) []*Message {
	return fromContext(ctx).(*mockClient).sent
}
