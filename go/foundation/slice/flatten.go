package slice

// Filter returns a new filtered list
func Flatten[T any](list [][]T) []T {
	var result []T
	for _, v := range list {
		if v != nil {
			result = append(result, v...)
		}
	}
	return result
}
