package enums

type HPBlobType string

const (
	HPBlobTypeUnknown HPBlobType = "unknown"
	HPBlobTypeImage   HPBlobType = "image"
	HPBlobTypeVideo   HPBlobType = "video"
	HPBlobTypeText    HPBlobType = "text"
)

type HPBlobSubType string

const (
	HPBlobSubTypeUnknown HPBlobSubType = "unknown"
	HPBlobSubTypeJpeg    HPBlobSubType = "jpeg"
	HPBlobSubTypeMp4     HPBlobSubType = "mp4"
	HPBlobSubTypeHtml    HPBlobSubType = "html"
)
