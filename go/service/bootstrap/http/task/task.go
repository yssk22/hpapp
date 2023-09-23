package task

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/yssk22/hpapp/go/service/errors"
	"github.com/yssk22/hpapp/go/system/http/s2s"
	"github.com/yssk22/hpapp/go/system/slog"
)

type TaskPolicy string

const (
	TaskPolicyAllow TaskPolicy = "allow"
	TaskPolicyDeny  TaskPolicy = "deny"
	TaskPolicySkip  TaskPolicy = "skip"
)

// Task is an interface to serve an http based task.
type Task interface {
	Path() string
	ServeHTTP(w http.ResponseWriter, req *http.Request)
}

// Parameters is an interface to serialize/deserialize payload for task parameters.
type Parameters[T any] interface {
	ToByte(*T) ([]byte, error)
	FromByte([]byte) (*T, error)
}

type noParameter[T any] struct{}

func (p *noParameter[T]) ToByte(v *T) ([]byte, error) {
	return nil, nil
}

func (p *noParameter[T]) FromByte(payload []byte) (*T, error) {
	return nil, nil
}

var _noparameter = &noParameter[any]{}

// NoPayload is a payload when the task doesn't require any parameters.
func NoParameter() Parameters[any] {
	return _noparameter
}

// JSONParameter is an example implemenation of parameter handler.
// The parameter is encoded/decoded by JSON.
type JSONParameter[T any] struct{}

func (spec *JSONParameter[T]) ToByte(v *T) ([]byte, error) {
	return json.Marshal(v)
}

func (spec *JSONParameter[T]) FromByte(payload []byte) (*T, error) {
	var v T
	if len(payload) > 0 {
		if err := json.Unmarshal(payload, &v); err != nil {
			return nil, err
		}
	}
	return &v, nil
}

type TaskOption[T any] func(t *TaskSpec[T])

func WithPolicy[T any](p func(context.Context, T) TaskPolicy) TaskOption[T] {
	return func(t *TaskSpec[T]) {
		t.policyFns = append(t.policyFns, p)
	}
}

func AlwaysAllow[T any]() TaskOption[T] {
	return WithPolicy(func(context.Context, T) TaskPolicy {
		return TaskPolicyAllow
	})
}

func AlwaysDeny[T any]() TaskOption[T] {
	return WithPolicy(func(context.Context, T) TaskPolicy {
		return TaskPolicyDeny
	})
}

// NewTask returns a new *TaskSpec[T] object.
// You can call the task via spec.Request(context.Context, params)
func NewTask[T any](path string, p Parameters[T], fn func(context.Context, T) error, options ...TaskOption[T]) *TaskSpec[T] {
	spec := &TaskSpec[T]{
		path:       path,
		parameters: p,
		fn:         fn,
	}
	for _, opt := range options {
		opt(spec)
	}
	return spec
}

// TaskSpec is a struct to define an implementation of Task.
type TaskSpec[T any] struct {
	path       string
	parameters Parameters[T]
	fn         func(context.Context, T) error
	policyFns  []func(context.Context, T) TaskPolicy
}

func (s *TaskSpec[T]) Path() string {
	return s.path
}

// ServeOn registers a http hanlder on the given mux to serve the task request.
func (s *TaskSpec[T]) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	slog.Track(ctx, "bootstrap.http.task", func(_ slog.Attributes) (any, error) { //nolint:errcheck // nothing can be done for error and Track() already logs it.
		buff, err := ioutil.ReadAll(req.Body)
		if err != nil {
			w.WriteHeader(500)
			_, _ = w.Write([]byte(err.Error()))
			return nil, err
		}
		payload, err := s.parameters.FromByte(buff)
		if err != nil {
			w.WriteHeader(500)
			_, _ = w.Write([]byte(err.Error()))
			return nil, err
		}
		var params T
		if payload != nil {
			params = *payload
		}
		lastPolicy := TaskPolicySkip
		for _, p := range s.policyFns {
			lastPolicy = p(ctx, params)
			if lastPolicy == TaskPolicyDeny {
				w.WriteHeader(403)
				_, _ = w.Write([]byte("permission denied"))
				return nil, err
			}
			if lastPolicy == TaskPolicyAllow {
				break
			}
		}
		if lastPolicy == TaskPolicySkip {
			slog.Warning(ctx, "task is executed without explicit `allow` policy", slog.Name("bootstrap.http.task.policy"))
		}
		err = s.fn(ctx, params)
		if err != nil {
			w.WriteHeader(500)
			_, _ = w.Write([]byte(err.Error()))
			return nil, err
		}
		w.WriteHeader(200)
		_, _ = w.Write([]byte("OK"))
		return nil, nil
	})
}

type contextHttpHeaderKey struct{}

var ctxHttpHeaderKey = contextHttpHeaderKey{}

func WithRequestHeader(ctx context.Context, header http.Header) context.Context {
	return context.WithValue(ctx, ctxHttpHeaderKey, header)
}

func (s *TaskSpec[T]) Request(ctx context.Context, params *T, options map[string]string) error {
	client := s2s.FromContext(ctx)
	buff, err := s.parameters.ToByte(params)
	if err != nil {
		return errors.Wrap(ctx, err)
	}
	// Copy http header to client request if there is an http request header in the context.
	header := ctx.Value(ctxHttpHeaderKey)
	if header != nil {
		if options == nil {
			options = make(map[string]string)
		}
		for key, values := range header.(http.Header) {
			options[fmt.Sprintf("http_%s", key)] = strings.Join(values, ",")
		}
	}
	return client.Request(ctx, s.Path(), buff, options)
}
