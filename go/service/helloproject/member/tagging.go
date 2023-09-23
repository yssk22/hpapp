package member

import (
	"bytes"
	"context"
	"io"
	"io/ioutil"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/slice"
	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/system/slog"
)

// Tagger is an interface to tag artists and/or members from content.
// Tagging is a process to find the potential candidates of content ownerships so implementation can return nil or emptly list.
// if there is an error, the implentation should log by themselves rather than expecting the caller to handle it.
type Tagger interface {
	GetTaggedArtists(context.Context, io.Reader) []*ent.HPArtist
	GetTaggedMembers(context.Context, io.Reader) []*ent.HPMember
}

// NewSimpleTextMatchingTagger returns a new Tagger that tags members by simple text matching.
// This tagger just uses text maching so it may not be accurate. We can have another version of tagger that uses ML.
func NewSimpleTextMatchingTagger() Tagger {
	return &simpleTextMatchingTagger{}
}

type simpleTextMatchingTagger struct{}

func (*simpleTextMatchingTagger) GetTaggedArtists(ctx context.Context, r io.Reader) []*ent.HPArtist {
	// some considerations:
	// 0) generally the artist name could be in English or Japanese though we don't have a good way to map between.
	// 1) for morningmusume, the content might have:
	//   a) no suffix: "モーニング娘。" only instead of "モーニング娘。'xx" or
	//   b) different suffix: "モーニング娘。'yy" instead of "モーニング娘。'xx"
	// 2) for juice=juice:
	//   a) = could be full-width or half-width.
	artists := GetAllArtists(ctx, true)
	content, err := ioutil.ReadAll(r)
	if err != nil {
		slog.Error(ctx, "io error",
			slog.Name("service.helloproject.member.tagging.SimpleTextMatchingTagger"),
			slog.Err(err),
		)
		return nil
	}
	content = bytes.ReplaceAll(content, []byte("　"), []byte(""))
	content = bytes.ReplaceAll(content, []byte(" "), []byte(""))
	content = bytes.ReplaceAll(content, []byte("山崎"), []byte("山﨑"))
	return assert.X(slice.Filter(artists, func(i int, artist *ent.HPArtist) (bool, error) {
		return bytes.Contains(content, []byte(artist.Name)), nil
	}))
}

func (*simpleTextMatchingTagger) GetTaggedMembers(ctx context.Context, r io.Reader) []*ent.HPMember {
	// some considerations:
	//   0) There could be space between 姓 and 名
	//   1) 山﨑愛生 could be written as 山崎愛生
	members := GetAllMembers(ctx, true)
	content, err := ioutil.ReadAll(r)
	if err != nil {
		slog.Error(ctx, "io error",
			slog.Name("service.helloproject.member.tagging.SimpleTextMatchingTagger"),
			slog.Err(err),
		)
		return nil
	}
	content = bytes.ReplaceAll(content, []byte("　"), []byte(""))
	content = bytes.ReplaceAll(content, []byte(" "), []byte(""))
	content = bytes.ReplaceAll(content, []byte("山崎"), []byte("山﨑"))
	return assert.X(slice.Filter(members, func(i int, member *ent.HPMember) (bool, error) {
		return bytes.Contains(content, []byte(member.Name)), nil
	}))
}
