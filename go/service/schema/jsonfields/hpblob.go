package jsonfields

type HPBlobThumbnail struct {
	StoragePath    string `json:"storagePath"`
	SourceImageURL string `json:"source_image_url"`
	Width          int    `json:"width"`
	Height         int    `json:"height"`
}

type HPBlobImageFace struct {
	Left        int      `json:"left"`
	Top         int      `json:"top"`
	Bottom      int      `json:"bottom"`
	Right       int      `json:"right"`
	ImageURL    string   `json:"image_url,omitempty"` // deprecated
	StoragePath string   `json:"storage_path,omitempty"`
	Label       *int     `json:"label,omitempty"`
	LabelScore  *float64 `json:"label_score,omitempty"`
}
