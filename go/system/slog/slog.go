/*
Package slog provides a structured logging facility for Go programs.

In hpapp, slog package is used to output structured logs. Structured logs must have a message field, and other structured data can be added as needed.
The slog package should only be used when implementing system and service, and should not be used when implementing foundation.

# Structured data that is automatically collected

The following data is automatically collected.

  - Timestamp
  - The path and the line of source code where the log code is located.
  - Stack trace at the time of logging
  - Context data (e.g. ID to identify the execution context)

# Log output

The log output destination must be implemented as a `slog.Sink` interface.

  - `NewNullSink()`: Don't log anything.
  - `NewMemorySink([]Record)`: Log to memory. This is useful for testing.
  - `NewIOSink(io.Writer, Formtter)`: Log to the specified io.Writer and the specified formatter.

For log formatter, the following are provided.

  - `JSONLFormatter`: JSONL format. Each log entry is output as a JSON object.
  - `JSONFormatter`: "%s [{Timestsamp}] [{Severity}] {Message} (at {SourcePath}:{SourceLine}) {Attribute}"
  - `SimpleFormatter`: "%s [{Timestsamp}] [{Severity}] {Message} (at {SourcePath}:{SourceLine})"
*/
package slog

import (
	"fmt"
	"log"
	"os"
	"runtime"
	"runtime/debug"
	"strings"
	"time"

	"github.com/yssk22/hpapp/go/system/clock"
	"github.com/yssk22/hpapp/go/system/context"
)

// Record is a structured logging record
type Record struct {
	Name            string                 `json:"name,omitempty"`
	SourcePath      string                 `json:"source_path,omitempty"`
	SourceLine      int                    `json:"source_line,omitempty"`
	Stack           []string               `json:"stack,omitempty"`
	Severity        Severity               `json:"severity,omitempty"`
	Timestamp       time.Time              `json:"timestamp,omitempty"`
	Message         string                 `json:"message,omitempty"`
	ContextInstance *context.Instance      `json:"context_instance,omitempty"`
	Attributes      map[string]interface{} `json:"attributes,omitempty"`
}

// Severity defines the importance of the logging record
type Severity string

const (
	SeverityDebug    = Severity("DEBUG")
	SeverityWarning  = Severity("WARNING")
	SeverityInfo     = Severity("INFO")
	SeverityError    = Severity("ERROR")
	SeverityCritical = Severity("CRITICAL")
)

// RecordOption is a function that configures a Record
type RecordOption func(r *Record)

// Name sets the key used to identify the log entry. Although the following naming rule is recommended, it is not limited to this.
//
//   - `system.{system_name}.{feature_name}.{function_name}`
//   - `service.{service_name}.{feature_name}.{function_name}`
//
// In the production environment, metrics are aggregated based on logs, so be careful when changing the name.
func Name(name string) RecordOption {
	return func(r *Record) {
		r.Name = name
	}
}

// Attribute adds the structured attributed field to the log entry in key-value format.
func Attribute(name string, value interface{}) RecordOption {
	return func(r *Record) {
		r.Attributes[name] = value
	}
}

// A is a shorthand for Attribute
func A(name string, value interface{}) RecordOption {
	return func(r *Record) {
		r.Attributes[name] = value
	}
}

// Err is a shorthand for Attribute("error", err.Error())
func Err(err error) RecordOption {
	return func(r *Record) {
		r.Attributes["error"] = err.Error()
	}
}

func IncludeStack() RecordOption {
	return func(r *Record) {
		r.Stack = strings.Split(string(debug.Stack()), "\n")
	}
}

func Debug(ctx context.Context, message string, opts ...RecordOption) {
	logRecord(ctx, SeverityDebug, message, opts...)
}

func Warning(ctx context.Context, message string, opts ...RecordOption) {
	logRecord(ctx, SeverityWarning, message, opts...)
}

func Info(ctx context.Context, message string, opts ...RecordOption) {
	logRecord(ctx, SeverityInfo, message, opts...)
}

func Error(ctx context.Context, message string, opts ...RecordOption) {
	logRecord(ctx, SeverityError, message, opts...)
}

func Critical(ctx context.Context, message string, opts ...RecordOption) {
	logRecord(ctx, SeverityCritical, message, opts...)
}

// X checks if the error is nil or not and returns the value. if error is not nil, it generate a log record.
// unlike assert.X, it has to be used with context so the syntax should be slog.X(ctx)(doSomething())
func X[T any](ctx context.Context) func(T, error) T {
	return func(v T, err error) T {
		if err != nil {
			logRecord(ctx, SeverityError, "unexpected error occurred", Err(err), IncludeStack())
		}
		return v
	}
}

type loggedError struct {
	inner error
}

func (l *loggedError) Error() string {
	return l.inner.Error()
}

func LogIfError(ctx context.Context, name string, err error) error {
	if err == nil {
		return nil
	}
	if _, ok := err.(*loggedError); ok {
		return err
	}
	logRecord(ctx, SeverityError, "unexepected error occurred", Name(name), IncludeStack())
	return &loggedError{err}
}

func PanicIfError(ctx context.Context, name string, err error) {
	if err == nil {
		return
	}
	logRecord(ctx, SeverityCritical, "unexepected error occurred, panic!!", Name(name), IncludeStack())
	panic(err)
}

type Attributes map[string]interface{}

func (a Attributes) Set(key string, value interface{}) {
	a[key] = value
}

func Track[T any](ctx context.Context, name string, f func(Attributes) (T, error), opts ...RecordOption) (val T, err error) {
	now := clock.Now(ctx)
	attributes := make(map[string]interface{})
	defer func() {
		elapsed := clock.Now(ctx).Sub(now).Milliseconds()
		for k, v := range attributes {
			opts = append(opts, Attribute(k, v))
		}
		x := recover()
		if x != nil {
			logRecord(ctx,
				SeverityCritical,
				fmt.Sprintf("Event %s failed", name),
				append(opts,
					Name(name),
					Attribute("error", fmt.Sprintf("%v", x)),
					Attribute("elapsed", elapsed),
					IncludeStack(),
				)...,
			)
			panic(x)
		}
		if err != nil {
			logRecord(ctx,
				SeverityError,
				fmt.Sprintf("Event %s failed", name),
				append(opts,
					Name(name),
					Attribute("error", fmt.Sprintf("%v", err)),
					Attribute("elapsed", elapsed),
					IncludeStack(),
				)...,
			)
			return
		}
		if err == nil {
			logRecord(ctx,
				SeverityInfo,
				fmt.Sprintf("Event %s completed", name),
				append(opts,
					Name(name),
					Attribute("elapsed", elapsed),
				)...,
			)
			return
		}
	}()
	val, err = f(attributes)
	return val, err
}

func logRecord(ctx context.Context, severity Severity, message string, opts ...RecordOption) {
	var sink Sink
	_, path, line, _ := runtime.Caller(2)
	obj := ctx.Value(ctxSinkKey)
	if obj == nil {
		sink = NewIOSink(os.Stderr, JSONFormatter)
	} else {
		sink = obj.(Sink)
	}
	now := clock.Now(ctx)
	contextInstance := context.GetInstance(ctx)
	record := &Record{
		Name:            "unknown",
		Severity:        severity,
		Message:         message,
		Timestamp:       now,
		SourcePath:      path,
		SourceLine:      line,
		ContextInstance: contextInstance,
		Attributes:      make(map[string]interface{}),
	}
	for _, opt := range opts {
		opt(record)
	}
	err := sink.Write(record)
	if err != nil {
		log.Println(err)
	}
}
