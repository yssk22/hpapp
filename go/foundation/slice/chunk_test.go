package slice

import "fmt"

func ExampleChunk() {
	var a = []int{0, 1, 2, 3, 4}
	var b = Chunk(a, 1)
	var c = Chunk(a, 3)
	fmt.Println(b)
	fmt.Println(c)
	// Output:
	// [[0] [1] [2] [3] [4]]
	// [[0 1 2] [3 4]]
}
