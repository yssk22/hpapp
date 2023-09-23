package slice

import "fmt"

func ExampleToMap() {
	var a = []string{"a", "b", "c", "d", "e"}
	var m = ToMap(a, func(i int, v string) string {
		return fmt.Sprintf("%d-%s", i, v)
	})
	fmt.Println(m["0-a"], m["1-b"], m["2-c"], m["3-d"], m["4-e"])
	// Output: a b c d e
}
