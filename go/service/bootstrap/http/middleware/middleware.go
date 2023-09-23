package middleware

import (
	"context"
	"net/http"
)

type HttpMiddleware interface {
	Process(r *http.Request) *Result
}

type Result struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Context context.Context
}

func NewWaterfall(middleware ...HttpMiddleware) HttpMiddleware {
	return &waterFall{
		middleware: middleware,
	}
}

type waterFall struct {
	middleware []HttpMiddleware
}

func (w *waterFall) Process(r *http.Request) *Result {
	result := &Result{
		Code:    200,
		Context: r.Context(),
	}
	for _, f := range w.middleware {
		result = f.Process(r)
		if result.Code >= 400 {
			return result
		}
		if result.Context != nil {
			r = r.WithContext(result.Context)
		}
	}
	return result
}
