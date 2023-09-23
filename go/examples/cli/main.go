package main

import (
	"github.com/yssk22/hpapp/go/service/bootstrap/cli"
	"github.com/yssk22/hpapp/go/system/database"
	"github.com/yssk22/hpapp/go/system/environment/devcontainer"
)

func main() {
	cli.RunCLI(devcontainer.NewEnvironment(
		devcontainer.WithDatabaseOptions(database.WithSQLite3File("./data/helloproject.db")),
	))
}
