package helper

import (
	"fmt"
	"os"
)

func ExitWithError(err error, usage string) {
	os.Stderr.WriteString(fmt.Sprintf("ERROR: %v\n", err))
	if usage != "" {
		os.Stderr.WriteString(usage)
	}
	os.Exit(1)
}
