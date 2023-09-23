package push

import "context"

type MessagePriority string

const (
	MessagePriorityDefault MessagePriority = "default"
	MessagePriorityNormal  MessagePriority = "normal"
	MessagePriorityHigh    MessagePriority = "high"
)

// Message is a struct to present push message for mobile applications
// We don't use the platform specific features such as subtitle on iOS.
type Message struct {
	// To is a slice of distinations. Each sender should recognize the distination to identify their actual address.
	To []string `json:"to,omitempty"`
	// Title is the title to display in the notification. Often displayed above the notification body
	Title string `json:"title,omitempty"`
	// Title is a message to display in the notification.
	Body string `json:"body"`
	// TTL is the number of seconds for which the message may be kept around for redelivery if it hasn't been delivered yet.
	// Defaults to undefined in order to use the respective defaults of each provider (0 for iOS/APNs and 2419200 (4 weeks) for Android/FCM).
	TTLSeconds int `json:"ttl,omitempty"`
	// The delivery priority of the message. Specify "default" or omit this field to use the default priority on each platform ("normal" on Android and "high" on iOS).
	Priority MessagePriority `json:"priority,omitempty"`
	// Sound is a sound when the recipient receives this notification. Specify "default" to play the device's default notification sound,
	// or omit this field to play no sound. Custom sounds are not supported.
	Sound string `json:"sound,omitempty"`
	// Badge is	a number to display in the badge on the app icon. Specify zero to clear the badge.
	Badge int `json:"badge,omitempty"`

	// Image is an configuration for the badge in push notification.
	// The field is not yet supprted by Expo Push API.
	ImageUrl string `json:"image_url,omitempty"`

	// Data contains the service specific data (so some clients recognize some fields)
	Data map[string]interface{} `json:"data,omitempty"`
}

type Client interface {
	// Send an message and returns the message IDs
	Send(context.Context, *Message) ([]string, error)
}

// Send sends a push message and returns their message IDs
// A single message can be split into multiple message ids when needed.
func Send(ctx context.Context, m *Message) ([]string, error) {
	return fromContext(ctx).Send(ctx, m)
}

type contextKey struct{}

var ctxClientKey = contextKey{}

func WithClient(ctx context.Context, store Client) context.Context {
	return context.WithValue(ctx, ctxClientKey, store)
}

func fromContext(ctx context.Context) Client {
	return ctx.Value(ctxClientKey).(Client)
}
