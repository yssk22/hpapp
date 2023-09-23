package jsonfields

import "time"

// HPIgCrawlArgs is a struct to store crawling args for HPIgPost.
// It is used to store the crawling args in the database to retry the crawling.
type HPIgCrawlArgs struct {
	ID            string                   `json:"id"`
	Shortcode     string                   `json:"shortcode"`
	Caption       string                   `json:"caption"`
	DisplayURL    string                   `json:"displayUrl"`
	VideoURL      string                   `json:"videoUrl"`
	OwnerUsername string                   `json:"ownerUsername"`
	OwnerID       string                   `json:"ownerId"`
	Hashtags      []string                 `json:"hashtags"`
	ChildPosts    []HPIgCrawlArgsChildPost `json:"childPosts"`
	Timestamp     time.Time                `json:"timestamp"`

	CommentsCount  int `json:"commentsCount"`
	LikesCount     int `json:"likesCount"`
	VideoViewCount int `json:"videoViewCount"`
}

type HPIgCrawlArgsChildPost struct {
	ID             string `json:"id"`
	Type           string `json:"type"`
	DisplayURL     string `json:"displayUrl"`
	VideoURL       string `json:"videoUrl"`
	LikesCount     int    `json:"likesCount"`
	VideoViewCount int    `json:"videoViewCount"`
}
