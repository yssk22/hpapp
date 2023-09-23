package slice

import "github.com/yssk22/hpapp/go/foundation/object"

func Index[T comparable](list []T, v T) int {
	return IndexFunc(list, func(_ int, vv T) bool {
		return object.Equal(vv, v)
	})
}

func IndexFunc[T any](list []T, f func(int, T) bool) int {
	for i, v := range list {
		if f(i, v) {
			return i
		}
	}
	return -1
}

func Contains[T comparable](list []T, v T) bool {
	return Index(list, v) >= 0
}

func ContainsFunc[T any](list []T, f func(int, T) bool) bool {
	return IndexFunc(list, f) >= 0
}

func Find[T comparable](list []T, v T) T {
	i := Index(list, v)
	if i >= 0 {
		return list[i]
	}
	return v
}

func FindFunc[T any](list []T, f func(int, T) bool) T {
	i := IndexFunc(list, f)
	if i >= 0 {
		return list[i]
	}
	var v T
	return v
}
