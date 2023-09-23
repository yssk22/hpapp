package settings

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/yssk22/hpapp/go/foundation/slice"
)

// Item is an interface to define a settings item.
type Item[T any] interface {
	Key() string
	Default() T
	ToBytes(T) []byte
	FromBytes([]byte) (T, error)
}

type stringItem struct {
	key          string
	defaultValue string
}

func (item *stringItem) Key() string {
	return item.key
}

func (item *stringItem) Default() string {
	return item.defaultValue
}

func (item *stringItem) ToBytes(v string) []byte {
	return []byte(v)
}

func (item *stringItem) FromBytes(v []byte) (string, error) {
	return string(v), nil
}

// NewStirng returns a new string item.
func NewString(key, defaultValue string) Item[string] {
	return &stringItem{key, defaultValue}
}

type intItem struct {
	key          string
	defaultValue int
}

func (item *intItem) Key() string {
	return item.key
}

func (item *intItem) Default() int {
	return item.defaultValue
}

func (item *intItem) ToBytes(v int) []byte {
	return []byte(fmt.Sprintf("%d", v))
}

func (item *intItem) FromBytes(v []byte) (int, error) {
	return strconv.Atoi(string(v))
}

// NewStirng returns a new int item.
func NewInt(key string, defaultValue int) Item[int] {
	return &intItem{key, defaultValue}
}

type durationItem struct {
	key          string
	defaultValue time.Duration
}

func (item *durationItem) Key() string {
	return item.key
}

func (item *durationItem) Default() time.Duration {
	return item.defaultValue
}

func (item *durationItem) ToBytes(v time.Duration) []byte {
	return []byte(v.String())
}

func (item *durationItem) FromBytes(v []byte) (time.Duration, error) {
	return time.ParseDuration(string(v))
}

// NewDuration returns a new int item.
func NewDuration(key string, defaultValue time.Duration) Item[time.Duration] {
	return &durationItem{key, defaultValue}
}

type stringArrayItem struct {
	key           string
	defaultValues []string
}

func (item *stringArrayItem) Key() string {
	return item.key
}

func (item *stringArrayItem) Default() []string {
	return item.defaultValues
}

func (item *stringArrayItem) ToBytes(v []string) []byte {
	return []byte(strings.Join(v, ","))
}

func (item *stringArrayItem) FromBytes(v []byte) ([]string, error) {
	return strings.Split(string(v), ","), nil
}

// NewStringArray returns a new []string item.
func NewStringArray(key string, defaultValue []string) Item[[]string] {
	return &stringArrayItem{key, defaultValue}
}

type intArrayItem struct {
	key           string
	defaultValues []int
}

func (item *intArrayItem) Key() string {
	return item.key
}

func (item *intArrayItem) Default() []int {
	return item.defaultValues
}

func (item *intArrayItem) ToBytes(v []int) []byte {
	list, _ := slice.Map(v, func(_ int, v int) (string, error) {
		return fmt.Sprintf("%d", v), nil
	})
	return []byte(strings.Join(list, ","))
}

func (item *intArrayItem) FromBytes(v []byte) ([]int, error) {
	return slice.Map(
		strings.Split(string(v), ","),
		func(i int, s string) (int, error) {
			return strconv.Atoi(s)
		},
	)
}

// NewIntArray returns a new []string item.
func NewIntArray(key string, defaultValue []int) Item[[]int] {
	return &intArrayItem{key, defaultValue}
}

type boolItem struct {
	key          string
	defaultValue bool
}

func (item *boolItem) Key() string {
	return item.key
}

func (item *boolItem) Default() bool {
	return item.defaultValue
}

func (item *boolItem) ToBytes(v bool) []byte {
	if v {
		return []byte("true")
	}
	return []byte("false")
}

func (item *boolItem) FromBytes(v []byte) (bool, error) {
	if string(v) == "true" {
		return true, nil
	}
	return false, nil
}

// NewBool returns a new bool item.
func NewBool(key string, defaultValue bool) Item[bool] {
	return &boolItem{key, defaultValue}
}
