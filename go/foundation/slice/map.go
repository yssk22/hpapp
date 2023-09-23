package slice

import (
	"fmt"
	"strconv"
	"sync"

	"github.com/yssk22/hpapp/go/foundation/errors"
)

// Map iterate the slice with it's pointer
func MapPtr[T any, T1 any](list []T, f func(i int, v *T) (T1, error)) ([]T1, error) {
	result := make([]T1, len(list))
	errs := make([]error, len(list))
	for i := range list {
		result[i], errs[i] = f(i, &list[i])
	}
	return result, errors.MultiError(errs).ToReturn()
}

// MapPtr iterate the slice with it's pointer but run function asynchronously
func MapPtrAsync[T any, T1 any](list []T, f func(i int, v *T) (T1, error)) ([]T1, error) {
	result := make([]T1, len(list))
	errs := make([]error, len(list))
	var wg sync.WaitGroup
	for i := range list {
		wg.Add(1)
		go func(j int) {
			result[j], errs[j] = f(j, &list[j])
			wg.Done()
		}(i)
	}
	wg.Wait()
	return result, errors.MultiError(errs).ToReturn()
}

// Map iterate the slice
func Map[T any, T1 any](list []T, f func(i int, v T) (T1, error)) ([]T1, error) {
	result := make([]T1, len(list))
	errs := make([]error, len(list))
	for i := range list {
		result[i], errs[i] = f(i, list[i])
	}
	return result, errors.MultiError(errs).ToReturn()
}

// Map iterate the slice but run function asynchronously
func MapAsync[T any, T1 any](list []T, f func(i int, v T) (T1, error)) ([]T1, error) {
	result := make([]T1, len(list))
	errs := make([]error, len(list))
	var wg sync.WaitGroup
	for i := range list {
		wg.Add(1)
		go func(j int) {
			result[j], errs[j] = f(j, list[j])
			wg.Done()
		}(i)
	}
	wg.Wait()
	return result, errors.MultiError(errs).ToReturn()
}

func MapStringToInt(list []string) ([]int, error) {
	return Map(list, func(_ int, v string) (int, error) {
		return strconv.Atoi(v)
	})
}

func MapIntToString(list []int) ([]string, error) {
	return Map(list, func(_ int, v int) (string, error) {
		return fmt.Sprintf("%d", v), nil
	})
}
