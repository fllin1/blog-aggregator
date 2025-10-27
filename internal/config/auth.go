package config

import (
	"errors"
)

func HandlerLogin(s *State, cmd Command) error {
	if len(cmd.Args) < 1 {
		return errors.New("username argument is required")
	}
	username := cmd.Args[0]
	err := s.Config.SetUser(username)
	if err != nil {
		return err
	}
	println("Logged in as " + username)
	return nil
}

func (c *Commands) Run(s *State, cmd Command) error {
	if handler, exists := c.Commands[cmd.Name]; exists {
		return handler(s, cmd)
	}
	return nil
}

func (c *Commands) Register(name string, f func(*State, Command) error) {
	c.Commands[name] = f
}
