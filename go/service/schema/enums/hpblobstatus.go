package enums

type HPBlobStatus string

const (
	HPBlobStatusUnknown      HPBlobStatus = "unknown"
	HPBlobStatusNeedDownload HPBlobStatus = "need_download" // media may be avaialble from original source but need to copy to the object storage
	HPBlobStatusReadyToHost  HPBlobStatus = "ready_to_host" // media is ready to host using canonical key
	HPBlobStatusError        HPBlobStatus = "error"         // media is unavailable due to an error
)
