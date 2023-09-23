package jsonfields

import (
	"encoding/json"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/system/push"
)

type ReactNavigationPush struct {
	Path        string                 `json:"path"`
	Params      map[string]interface{} `json:"params"`
	PushMessage ExpoPushMessage        `json:"push_message"`
}

type ExpoPushMessage struct {
	Title      string               `json:"title,omitempty"`
	Body       string               `json:"body"`
	TTLSeconds int                  `json:"ttl,omitempty"`
	Priority   push.MessagePriority `json:"priority,omitempty"`
	Sound      string               `json:"sound,omitempty"`
	Badge      int                  `json:"badge,omitempty"`
	ImageUrl   string               `json:"image_url,omitempty"`
}

func (r *ReactNavigationPush) ToPushMessage(tokens []string) *push.Message {
	payload := assert.X(json.Marshal(map[string]interface{}{
		"path":   r.Path,
		"params": r.Params,
	}))
	return &push.Message{
		To:         tokens,
		Title:      r.PushMessage.Title,
		Body:       r.PushMessage.Body,
		TTLSeconds: r.PushMessage.TTLSeconds,
		Priority:   r.PushMessage.Priority,
		Sound:      r.PushMessage.Sound,
		Badge:      r.PushMessage.Badge,
		ImageUrl:   r.PushMessage.ImageUrl,
		Data: map[string]interface{}{
			"type":    "react_navigation_push",
			"payload": string(payload),
		},
	}
}
