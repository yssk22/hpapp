package helper

import (
	"testing"
)

func TestTag_ParseFieldTag(t *testing.T) {
	cases := []struct {
		input  string
		output []string
	}{
		{
			input:  `foo:"bar" hoge:"fuga"`,
			output: []string{"bar"},
		},
		{
			input:  `foo:"bar,hoge"`,
			output: []string{"bar", "hoge"},
		},
	}
	for _, c := range cases {
		t.Run(c.input, func(tt *testing.T) {
			got, err := ParseFieldTag("foo", c.input)
			if err != nil {
				tt.Errorf("cannot parse tag: %v", err)
			}
			if len(got) != len(c.output) {
				tt.Errorf("expected: %s, got: %s", c.output, got)
			}
			for i, g := range got {
				if g != c.output[i] {
					tt.Errorf("expected: %s, got: %s (mismatch at %d)", c.output, got, i)
				}
			}
		})
	}
}
