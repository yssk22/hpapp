// slog package provides a structured logging facility for Go programs.
package slog

import (
	"fmt"
	"log"
	"os"
	"runtime"
	"runtime/debug"
	"strings"
	"time"

	"hpapp.yssk22.dev/go/system/clock"
	"hpapp.yssk22.dev/go/system/context"
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

func Name(name string) RecordOption {
	return func(r *Record) {
		r.Name = name
	}
}

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
