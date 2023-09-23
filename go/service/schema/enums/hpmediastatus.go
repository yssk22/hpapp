package enums

type HPMediaStatus string

const (
	HPMediaStatusUnknown      HPMediaStatus = "unknown"
	HPMediaStatusNeedDownload HPMediaStatus = "need_download" // media may be avaialble from original source but need to copy to the object storage
	HPMediaStatusReadyToHost  HPMediaStatus = "ready_to_host" // media is ready to host using canonical key
	HPMediaStatusError        HPMediaStatus = "error"         // media is unavailable due to an error
)
