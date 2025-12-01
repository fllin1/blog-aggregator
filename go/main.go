package main

import (
	"fmt"
	"os"

	"github.com/fllin1/blog-aggregator/internal/config"
)

func main() {
	cfg, err := config.Read()
	if err != nil {
		fmt.Println("Failed to read config: " + err.Error())
		return
	}

	state := &config.State{Config: &cfg}

	commands := &config.Commands{Commands: make(map[string]func(*config.State, config.Command) error)}

	commands.Register("login", config.HandlerLogin)

	if len(os.Args) < 2 {
		fmt.Println("No command provided")
		os.Exit(1)
	}

	cmd := config.Command{
		Name: os.Args[1],
		Args: os.Args[2:],
	}

	err = commands.Run(state, cmd)
	if err != nil {
		fmt.Println("Error executing command: " + err.Error())
		os.Exit(1)
	}
}
