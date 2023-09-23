package member

import (
	"bytes"
	"context"
	"testing"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
)

func TestTagging(t *testing.T) {
	test.New("SimpleTextTagger", test.WithHPMaster()).Run(t, func(ctx context.Context, t *testing.T) {
		a := assert.NewTestAssert(t)
		tagger := NewSimpleTextMatchingTagger()
		members := tagger.GetTaggedMembers(ctx, bytes.NewBufferString("譜久村聖大好きすぎる"))
		a.Equals(1, len(members))
		a.Equals("譜久村聖", members[0].Name)

		members = tagger.GetTaggedMembers(ctx, bytes.NewBufferString("大好きすぎる"))
		a.Equals(0, len(members))

		members = tagger.GetTaggedMembers(ctx, bytes.NewBufferString("譜久村聖さんと生田衣梨奈さんは同期です。譜久村聖さんはモーニング娘。のリーダーです。"))
		a.Equals(2, len(members)) // not 3 as the second occurance of "譜久村聖" is ignored.
		a.Equals("譜久村聖", members[0].Name)
		a.Equals("生田衣梨奈", members[1].Name)
	})
}
