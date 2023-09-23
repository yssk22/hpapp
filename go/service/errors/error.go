package errors

import (
	"context"
	"fmt"

	"hpapp.yssk22.dev/go/system/slog"
)

// ServiceError is an interface to avoid over wrapping by errors.Wrap
// If a service has a well defined error that can be passed to the clients/users, it should implement this interface
// so that client can handle the error properly.
type ServiceError interface {
	DoNotWrap()
}

type serviceError struct {
	message    string
	inner      error
	logOptions []slog.RecordOption
}

func (e *serviceError) Error() string {
	return e.message
}

func (e *serviceError) DoNotWrap() {}

type Option func(*serviceError)

func Message(msg string) Option {
	return func(se *serviceError) {
		se.message = msg
	}
}

// New returns a new service error with a specified message, which could be shown to users.
func New(msg string, options ...Option) error {
	err := &serviceError{
		message: msg,
		logOptions: []slog.RecordOption{
			slog.IncludeStack(),
			slog.Name("service.errros"),
		},
	}
	for _, opt := range options {
		opt(err)
	}
	if _, ok := err.inner.(*serviceError); ok {
		return err.inner
	}
	return err
}

func SlogOptions(options ...slog.RecordOption) Option {
	return func(e *serviceError) {
		e.logOptions = append(e.logOptions, options...)
	}
}

// Wrap returns a service error if the given inner error is not a service error.
// The message shown to the user would 'internal service error', but the message of the inner error is logged to the system.
// If the inner error is service error, it is returned directly.
func Wrap(ctx context.Context, inner error, options ...Option) error {
	if inner == nil {
		return nil
	}
	if _, ok := inner.(ServiceError); ok {
		return inner
	}
	// TODO: privacy.Deny to be handled not as 'internal service error' but as 'permission denied'
	err := New("internal service error", options...).(*serviceError)
	err.inner = inner
	slog.Error(ctx, fmt.Sprintf("%v", inner.Error()), err.logOptions...)
	return err
}

func Unwrap(err error) error {
	if se, ok := err.(*serviceError); ok {
		if se.inner != nil {
			return se.inner
		}
		return se
	}
	return nil
}
