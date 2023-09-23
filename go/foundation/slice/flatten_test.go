package slice

import "fmt"

func ExampleFlatten() {
	var a = [][]int{
		{0, 1, 2},
		{3, 4},
	}
	fmt.Println(Flatten(a))
	// Output: [0 1 2 3 4]
}
