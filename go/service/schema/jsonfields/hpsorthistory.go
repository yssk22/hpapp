package jsonfields

// HPSortResult is a set of results by HPSort
type HPSortResult struct {
	Records []HPSortResultRecord `json:"records"`
}

// HPSortResultRecord is a record to hold a member and it's point.
type HPSortResultRecord struct {
	ArtistID  int
	ArtistKey string
	MemberID  int
	MemberKey string
}
