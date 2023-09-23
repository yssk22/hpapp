package slog

import (
	"encoding/json"
	"fmt"
	"strings"
)

// Formatter is an interface that formats a Record.
type Formatter interface {
	Format(r *Record) ([]byte, error)
}

// FormatterFunc is a function that creates a new Formatter from a function
type FormatterFunc func(r *Record) ([]byte, error)

func (f FormatterFunc) Format(r *Record) ([]byte, error) {
	return f(r)
}

// JSONLFomatter is a Formatter that formats a Record as a JSON line.
var JSONLFormatter = FormatterFunc(func(r *Record) ([]byte, error) {
	buff, err := json.Marshal(r)
	if err != nil {
		return nil, err
	}
	buff = append(buff, '\n')
	return buff, nil
})

// JSONFomatter is a Formatter that formats a Record as a simple message text with JSON.
var JSONFormatter = FormatterFunc(func(r *Record) ([]byte, error) {
	obj, err := json.MarshalIndent(r.Attributes, "", "  ")
	if err != nil {
		return nil, err
	}
	s := []string{fmt.Sprintf(
		"%s [%s] [%s] %s (at %s:%d) %s\n",
		r.Timestamp.Format("2006-01-02T15:04:05.999999"),
		r.Severity,
		r.Name,
		r.Message,
		r.SourcePath,
		r.SourceLine,
		obj,
	)}
	if len(r.Stack) > 0 {
		s = append(s, r.Stack...)
	}

	return []byte(strings.Join(s, "\n")), nil
})

// SimpleFormatter is a Formatter that formats a Record with message and timestasmp
var SimpleFormatter = FormatterFunc(func(r *Record) ([]byte, error) {
	return []byte(fmt.Sprintf(
		"%s [%s] [%s] %s (at %s:%d)",
		r.Timestamp.Format("2006-01-02T15:04:05.999999"),
		r.Severity,
		r.Name,
		r.Message,
		r.SourcePath,
		r.SourceLine,
	)), nil
})
