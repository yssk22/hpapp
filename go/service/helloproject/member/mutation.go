package member

import (
	"context"
	"strings"

	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/errors"
	"github.com/yssk22/hpapp/go/system/slog"
)

type HPMemberUpdateParams struct {
	MemberID  int
	ColorRGB  string
	ColorName string
}

func UpdateMemberAttributes(ctx context.Context, params HPMemberUpdateParams) (*ent.HPMember, error) {
	// TODO: validate RGB format
	// check params.ColorRGB is the valid RGB format starting with '#' OR empty (which means no color)
	if params.ColorRGB != "" {
		if !strings.HasPrefix(params.ColorRGB, "#") || len(params.ColorRGB) != 7 {
			return nil, errors.New("invalid RGB format")
		}
		for _, char := range params.ColorRGB[1:] {
			if !((char >= '0' && char <= '9') || (char >= 'a' && char <= 'f') || (char >= 'A' && char <= 'F')) {
				return nil, errors.New("invalid RGB format")
			}
		}
	}

	client := entutil.NewClient(ctx)
	member, err := client.HPMember.Get(ctx, params.MemberID)
	if err != nil {
		return nil, errors.Wrap(ctx, err, errors.SlogOptions(
			slog.Attribute("member_id", params.MemberID),
		))
	}
	update := client.HPMember.UpdateOne(member)
	update.SetColorRgb(strings.ToLower(params.ColorRGB))
	update.SetColorName(params.ColorName)
	err = update.Exec(ctx)
	if err != nil {
		return nil, err
	}
	return member, nil
}
