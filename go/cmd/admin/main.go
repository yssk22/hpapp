package main

import (
	"hpapp.yssk22.dev/go/service/bootstrap"
	"hpapp.yssk22.dev/go/service/bootstrap/cli"
)

func main() {
	cli.RunCLI(
		bootstrap.GetDefaultEnvironment(),
		bootstrap.GetDefaultServices()...,
	)
}
