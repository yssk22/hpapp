package database

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

type mysql struct {
	location string
	database string
	username string
	password string
}

func (m mysql) URI() string {
	return fmt.Sprintf("%s:%s@%s/%s?parseTime=true", m.username, m.password, m.location, m.database)
}

type MySQLOption func(*mysql)

// WithMySQLLocation use the given location to connect to the database
// location string is something like `tcp({host}:{port})` or `unix(/cloudsql/{project}))`
func WithMySQLLocation(location string) MySQLOption {
	return func(m *mysql) {
		m.location = location
	}
}

func WithMySQLUsername(username string) MySQLOption {
	return func(m *mysql) {
		m.username = username
	}
}

func WithMySQLPassword(password string) MySQLOption {
	return func(m *mysql) {
		m.password = password
	}
}

func WithMySQLDatabase(database string) MySQLOption {
	return func(m *mysql) {
		m.database = database
	}
}

func NewMySQL(opts ...MySQLOption) *sql.DB {
	s := mysql{
		location: "tcp(localhost:3306)",
		username: "mizukifukumura",
		password: "19961030",
	}
	for _, opt := range opts {
		opt(&s)
	}
	db, err := sql.Open("mysql", s.URI())
	if err != nil {
		panic(err)
	}
	return db
}
