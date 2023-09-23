package database

import (
	"context"
	"database/sql"
)

type Info struct {
	Name string
	DB   *sql.DB
}

type contextDatabaseKey struct{}

var ctxDatabaseKey = contextDatabaseKey{}

func SetDatabase(ctx context.Context, name string, db *sql.DB) context.Context {
	return context.WithValue(ctx, ctxDatabaseKey, &Info{
		Name: name,
		DB:   db,
	})
}

func FromContext(ctx context.Context) *Info {
	return ctx.Value(ctxDatabaseKey).(*Info)
}
