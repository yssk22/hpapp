package jsonfields

import "time"

type TestJSON struct {
	String   string    `json:"string,omitempty"`
	Int      int       `json:"int,omitempty"`
	DateTime time.Time `json:"datetime,omitempty"`
}
