/*
Package settings privides the service settings management feature.

# Define settings

To define settings, use `settings.New()` functions. This function loads an object with the settings.Item interface into the program.
The following example defines a string setting with the key `foo`. If the setting is not saved anywhere, the definition returns `"default_value"` when `foo` is referenced.

	var MySettings = settings.NewString("foo", "default_value")

We recommend that the key naming convention for settings is `service.{service_name}.{feature_name}.{function_name}`, but this is not always enforced.

# Refer to settings

To refer to the defined settings, simply call `settings.Get(context.Context, settings.Item)`. The settings are stored in the settings store in the context.Context

	fooValue, err := settings.Get(ctx, MySettings)

If there is no value in the settigs store, the code also refer to the environment variable, named as the key in uppercase.
In the above example, it refers to the value of the environment variable `FOO`. If both fails, it returns the default value.

You can also confirm the setting value from the command line.

	$ go run ./cmd/admin/ settings get foo

# Update settings

To update settings, use command.

	$ go run ./cmd/admin/ settings set foo newValue

By default, the settings are saved in the `./data/settings.json` file. Therefore, the file is updated as follows.

	{
		"foo": "newValue"
	}

# List all settings

`list` command returns all settings in your application.

	$ go run ./cmd/admin/ settings list

This list come from the package scoped variable defined using `settings.New` function in all packages under `helloproject.ap/go/`.
So you should define the settings variable at the package that is most used.

If you want to get a list of settings in the program, use `settings.CaptureSettings("pacakge_name")`. This returns a list of `settings.ItemInfo` for the settings declared in `package_name`.
*/
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
