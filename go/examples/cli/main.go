package main

import (
	"hpapp.yssk22.dev/go/service/bootstrap/cli"
	"hpapp.yssk22.dev/go/system/database"
	"hpapp.yssk22.dev/go/system/environment/devcontainer"
)

func main() {
	cli.RunCLI(devcontainer.NewEnvironment(
		devcontainer.WithDatabaseOptions(database.WithSQLite3File("./data/helloproject.db")),
	))
}
