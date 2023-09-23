package slice

import "fmt"

func ExampleMap() {
	var a = []int{0, 1, 2, 3, 4}
	b, _ := Map(a, func(i int, v int) (string, error) {
		return fmt.Sprintf("%d", v+1), nil
	})
	fmt.Println(b)
	// Output: [1 2 3 4 5]
}

func ExampleMapAsync() {
	var a = []int{0, 1, 2, 3, 4}
	b, _ := MapAsync(a, func(i int, v int) (int, error) {
		return v * 2, nil
	})
	fmt.Println(b)
	// Output: [0 2 4 6 8]
}

func ExampleMapPtr() {
	type s struct {
		num int
	}
	var a = []s{{0}, {1}, {2}, {3}, {4}}
	b, _ := MapPtr(a, func(i int, v *s) (*s, error) {
		return v, nil
	})
	c, _ := Map(b, func(i int, v *s) (int, error) {
		return v.num + 1, nil
	})
	fmt.Println(c)
	// Output: [1 2 3 4 5]
}

func ExampleMapPtrAsync() {
	type s struct {
		num int
	}
	var a = []s{{0}, {1}, {2}, {3}, {4}}
	b, _ := MapPtrAsync(a, func(i int, v *s) (*s, error) {
		v.num = v.num * 2
		return v, nil
	})
	c, _ := Map(b, func(i int, v *s) (int, error) {
		return v.num + 1, nil
	})
	fmt.Println(c)
	// Output: [1 3 5 7 9]
}
