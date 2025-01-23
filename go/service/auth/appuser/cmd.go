package appuser

import (
	"fmt"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/spf13/cobra"
	"github.com/yssk22/hpapp/go/system/settings"
)

func Command() *cobra.Command {
	cmd := cobra.Command{
		Use:   "appuser",
		Short: "app user related commands",
	}
	debugToken := cobra.Command{
		Use:   "debug-token",
		Short: "generate a new user",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			signKey := settings.GetX(cmd.Context(), JWTSignKey)
			tok, err := jwt.ParseWithClaims(args[0], &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
				return []byte(signKey), nil
			})
			if tok == nil && err != nil {
				fmt.Println("jwt.ParseWithClaims failed: ", err)
			}
			token := tok.Claims.(*JWTClaims)
			fmt.Println("        Id:", token.Id)   // id
			fmt.Println("      Name:", token.Name) // username
			fmt.Println(" Issued At:", time.Unix(token.IssuedAt, 0))
			fmt.Println("Expired At:", time.Unix(token.ExpiresAt, 0))
			return nil
		},
	}
	cmd.AddCommand(&debugToken)
	return &cmd
}
