package cli

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"text/tabwriter"
)

// Ask a question and return the input
func Ask(question string) string {
	fmt.Printf("%s> ", question)
	stdin := bufio.NewScanner(os.Stdin)
	stdin.Scan()
	return stdin.Text()
}

// Confirm a question and return yes or no.
func Confirm(question string) bool {
	a := Ask(fmt.Sprintf("%s (y/N)", question))
	return strings.ToLower(a) == "y"
}

type TableWriter struct {
	w      *tabwriter.Writer
	header []string
}

func (w *TableWriter) WriteRow(row []string) {
	if len(w.header) != len(row) {
		panic("row length does not match header length")
	}
	_, err := w.w.Write([]byte(strings.Join(row, "\t") + "\n"))
	if err != nil {
		panic(err)
	}
}

func (w *TableWriter) Flush() {
	w.w.Flush()
}

func NewTableWriter(header []string) *TableWriter {
	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
	_, err := w.Write([]byte(strings.Join(header, "\t") + "\n"))
	if err != nil {
		panic(err)
	}
	return &TableWriter{
		w:      w,
		header: header,
	}
}
