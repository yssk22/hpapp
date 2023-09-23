package object

func Equal[T comparable](v1 T, v2 T) bool {
	var vv interface{} = v1
	vvv, ok := vv.(interface {
		Equal(T) bool
	})
	if ok {
		return vvv.Equal(v2)
	}
	return v1 == v2
}

func Nullable[T any](v T) *T {
	return &v
}

var NullableFalse = Nullable(false)
var NullableTrue = Nullable(true)

func Keys[T comparable, V any](v map[T]V) []T {
	var keys []T
	for k := range v {
		keys = append(keys, k)
	}
	return keys
}

func Values[T comparable, V any](v map[T]V) []V {
	var values []V
	for _, vv := range v {
		values = append(values, vv)
	}
	return values
}
