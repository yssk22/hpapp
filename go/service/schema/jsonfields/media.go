package jsonfields

import "github.com/yssk22/hpapp/go/service/schema/enums"

type Media struct {
	Url    string           `json:"url,omitempty"`     // original url
	BlobID int              `json:"blob_id,omitempty"` // id on HPBlob
	Type   enums.HPBlobType `json:"type,omitempty"`    // "video", "image", ...
	Width  int              `json:"width,omitempty"`   // width of the media
	Height int              `json:"height,omitempty"`  // height of the media

	ThumbnailUrl    string `json:"thumbnail_url,omitempty"`    // thumbnail url to display
	ThumbnailWidth  int    `json:"thumbnail_width,omitempty"`  // thumbnail url to display
	ThumbnailHeight int    `json:"thumbnail_height,omitempty"` // thumbnail url to display
}
