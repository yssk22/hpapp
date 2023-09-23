package main

import (
	"github.com/yssk22/hpapp/go/service/bootstrap"
	"github.com/yssk22/hpapp/go/service/bootstrap/cli"
)

func main() {
	cli.RunCLI(
		bootstrap.GetDefaultEnvironment(),
		bootstrap.GetDefaultServices()...,
	)
}
