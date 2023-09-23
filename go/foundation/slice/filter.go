package slice

import "hpapp.yssk22.dev/go/foundation/errors"

// Filter returns a filtered elements that matches condition f from the slice
func Filter[T any](list []T, f func(i int, v T) (bool, error)) ([]T, error) {
	var result []T
	errs := make([]error, len(list))
	for i := range list {
		v, err := f(i, list[i])
		if err != nil {
			errs[i] = err
			continue
		}
		if v {
			result = append(result, list[i])
		}
	}
	return result, errors.MultiError(errs).ToReturn()
}
