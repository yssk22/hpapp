package slice

import "fmt"

func ExampleUnique() {
	var a = []int{0, 1, 2, 2, 3, 2, 3, 4}
	var b = Unique(a, func(i int, v int) string {
		return fmt.Sprintf("%d", v)
	})
	fmt.Println(b)
	// Output: [0 1 2 3 4]
}
