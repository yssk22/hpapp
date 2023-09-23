package stringutil

import (
	"crypto/rand"
	"math/big"
	"strings"
	"unicode"

	"golang.org/x/exp/utf8string"
)

// Mask returns a masked string.
func Mask(s string, n int) string {
	if n >= len(s) {
		return s
	}
	return s[:n] + "..."
}

// RandomString returns a random string.
func RandomString(n int) string {
	return RandomStringWith(n, []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"))
}

// RandomStringWith returns a random string by given letters
func RandomStringWith(n int, letters []rune) string {
	b := make([]rune, n)
	max := big.NewInt(int64(len(letters)))
	for i := range b {
		n, err := rand.Int(rand.Reader, max)
		if err != nil {
			panic(err)
		}
		b[i] = letters[n.Int64()]
	}
	return string(b)
}

// ToLowerCamelCase converts the string to the one by camlCase
func ToLowerCamelCase(s string) string {
	if len(s) == 0 {
		return s
	}
	tokens := tokenize(s)
	for i, t := range tokens {
		tail := t[1:]
		if i == 0 {
			tokens[i] = string(unicode.ToLower(rune(t[0]))) + strings.ToLower(tail)
		} else {
			tokens[i] = string(unicode.ToUpper(rune(t[0]))) + strings.ToLower(tail)
		}
	}
	return strings.Join(tokens, "")
}

// ToSnakeCase converts the string to the one by snake case.
func ToSnakeCase(s string) string {
	if len(s) == 0 {
		return s
	}
	tokens := tokenize(s)
	for i, t := range tokens {
		tokens[i] = strings.ToLower(t)
	}
	return strings.Join(tokens, "_")
}

type runeType int

const (
	runeTypeUpper runeType = iota
	runeTypeLower
	runeTypeDigit
	runeTypeOther
)

func tokenize(s string) []string {
	if len(s) == 0 {
		return []string{}
	}
	var runes = []rune(s)
	var token []rune = []rune{runes[0]}
	var tokens []string
	var l = len(runes)
	for i := 1; i < l; i++ {
		currentType := getRuneType(runes[i])
		previousType := getRuneType(runes[i-1])
		switch currentType {
		case runeTypeUpper:
			if i < l-1 && getRuneType(runes[i+1]) == runeTypeLower {
				tokens = append(tokens, string(token))
				token = []rune{}
				token = append(token, runes[i])
			} else if previousType == runeTypeUpper {
				token = append(token, runes[i])
			} else {
				tokens = append(tokens, string(token))
				token = []rune{}
				token = append(token, runes[i])
			}
		case runeTypeLower:
			if previousType == runeTypeUpper || previousType == runeTypeLower {
				token = append(token, runes[i])
			} else {
				tokens = append(tokens, string(token))
				token = []rune{}
				token = append(token, runes[i])
			}
		case runeTypeDigit:
			token = append(token, runes[i])
		case runeTypeOther:
			break
		}
	}
	if len(token) > 0 {
		tokens = append(tokens, string(token))
	}
	return tokens
}

func getRuneType(c rune) runeType {
	if unicode.IsUpper(c) {
		return runeTypeUpper
	} else if unicode.IsLower(c) {
		return runeTypeLower
	} else if unicode.IsDigit(c) {
		return runeTypeDigit
	}
	return runeTypeOther
}

func Or(s string, or string) string {
	if s != "" {
		return s
	}
	return or
}

func UTF8Slice(s string, n int) string {
	utf8s := utf8string.NewString(s)
	l := utf8s.RuneCount()
	if n < l {
		return utf8s.Slice(0, n)
	}
	return utf8s.Slice(0, l)
}
