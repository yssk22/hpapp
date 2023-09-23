package stringutil

import (
	"fmt"
	"testing"

	"github.com/yssk22/hpapp/go/foundation/assert"
)

func TestMask(t *testing.T) {
	a := assert.NewTestAssert(t)
	a.Equals("hello", Mask("hello", 5))
	a.Equals("hello", Mask("hello", 6))
	a.Equals("hel...", Mask("hello", 3))
	a.Equals("...", Mask("hello", 0))
	a.Equals("hello", Mask("hello", 10))
}

func TestToLowerCamleCase(t *testing.T) {
	cases := []struct {
		input          string
		useUpperAtHead bool
		output         string
	}{
		{
			input:  "foo_bar_baz",
			output: "fooBarBaz",
		},
		{
			input:  "my_url",
			output: "myUrl",
		},
		{
			input:  "url_is_not_good",
			output: "urlIsNotGood",
		},
		{
			input:  "url123_is_not_good",
			output: "url123IsNotGood",
		},
		{
			input:  "URLIsNotID",
			output: "urlIsNotId",
		},
	}
	for _, c := range cases {
		t.Run(c.input, func(tt *testing.T) {
			a := assert.NewTestAssert(tt)
			got := ToLowerCamelCase(c.input)
			a.Equals(c.output, got)
		})
	}
}

func TestToSnakeCase(t *testing.T) {
	cases := []struct {
		input  string
		output string
	}{
		{
			input:  "FooBarBaz",
			output: "foo_bar_baz",
		},
		{
			input:  "MyURL",
			output: "my_url",
		},
		{
			input:  "URLIsNotGood",
			output: "url_is_not_good",
		},
		{
			input:  "URL123IsNotGood",
			output: "url123_is_not_good",
		},
	}
	for _, c := range cases {
		t.Run(c.input, func(tt *testing.T) {
			a := assert.NewTestAssert(tt)
			got := ToSnakeCase(c.input)
			a.Equals(c.output, got)
		})
	}
}

func Test_tokenize(t *testing.T) {
	cases := []struct {
		input  string
		output []string
	}{
		{
			input:  "foo_bar_baz",
			output: []string{"foo", "bar", "baz"},
		},
		{
			input:  "fooBarBaz",
			output: []string{"foo", "Bar", "Baz"},
		},
		{
			input:  "URLIsNotID",
			output: []string{"URL", "Is", "Not", "ID"},
		},
		{
			input:  "URL123IsNotID",
			output: []string{"URL123", "Is", "Not", "ID"},
		},
		{
			input:  "URL123isNotID",
			output: []string{"URL123", "is", "Not", "ID"},
		},
	}
	for _, c := range cases {
		t.Run(c.input, func(tt *testing.T) {
			a := assert.NewTestAssert(tt)
			got := tokenize(c.input)
			a.Equals(c.output, got)
		})
	}
}

func TestOr(t *testing.T) {
	a := assert.NewTestAssert(t)
	a.Equals("a", Or("a", "b"))
	a.Equals("b", Or("", "b"))
}

func ExampleUTF8Slice() {
	fmt.Println(
		UTF8Slice("あいうえお", 1),
		UTF8Slice("あいうえお", 10),
	)
	// Output:
	// あ あいうえお
}
