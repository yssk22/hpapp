package database

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

type SQLite3Mode string

const (
	SQLite3ModeMemory       = SQLite3Mode("memory")
	SQLite3ModeFile         = SQLite3Mode("rwc")
	SQLite3ModeReadOnlyFile = SQLite3Mode("ro")
)

type sqlite struct {
	filePath string
	mode     SQLite3Mode
}

func (s sqlite) URI() string {
	// always add _fk=1 to enable foreign key constraits
	return fmt.Sprintf("file:%s?mode=%s&cache=shared&_fk=1", s.filePath, s.mode)
}

type SQLite3Option func(*sqlite)

func WithSQLite3File(filePath string) SQLite3Option {
	return func(s *sqlite) {
		s.filePath = filePath
	}
}

func WithSQLite3Mode(mode SQLite3Mode) SQLite3Option {
	return func(s *sqlite) {
		s.mode = mode
	}
}

func NewSQLite(opts ...SQLite3Option) *sql.DB {
	s := sqlite{
		filePath: "helloproject.db",
		mode:     "memory",
	}
	for _, opt := range opts {
		opt(&s)
	}
	db, err := sql.Open("sqlite3", s.URI())
	if err != nil {
		panic(err)
	}
	db.SetConnMaxIdleTime(1 * time.Hour)
	db.SetConnMaxLifetime(1 * time.Hour)
	return db
}
