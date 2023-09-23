package models

import (
	"fmt"
	"io"
	"strconv"
)

func (e MyEnum) MarshalGQL(w io.Writer) {
	switch e {
	case MyEnumValueA:
		fmt.Fprint(w, strconv.Quote("value_a"))
	case MyEnumValueB:
		fmt.Fprint(w, strconv.Quote("value_b"))
	}
}

func (e *MyEnum) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "value_a":
		*e = MyEnumValueA
	case "value_b":
		*e = MyEnumValueB
	}
	return nil
}

