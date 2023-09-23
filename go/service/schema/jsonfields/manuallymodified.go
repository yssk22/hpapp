package jsonfields

type ManuallyModified struct {
	FieldName     string
	AllowOverride bool // if true, crawler can override field values
}
