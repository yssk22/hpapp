package slice

func Unique[T any](list []T, fun func(i int, v T) string) []T {
	var result []T
	var exists = make(map[string]bool)
	for i, v := range list {
		key := fun(i, v)
		if _, ok := exists[key]; !ok {
			result = append(result, v)
			exists[key] = true
		}
	}
	return result
}
