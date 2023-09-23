package common

// First normalizes (first *int) parameter
func First(v *int, def int) *int {
	if v == nil {
		return &def
	}
	if *v > def {
		return &def
	}
	return v
}
