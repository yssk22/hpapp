package upfc

import (
	"context"
	"fmt"
	"time"

	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/service/ent"
	"github.com/yssk22/hpapp/go/service/ent/hpevent"
	"github.com/yssk22/hpapp/go/service/ent/hpfceventticket"
	"github.com/yssk22/hpapp/go/service/ent/user"
	"github.com/yssk22/hpapp/go/service/entutil"
	"github.com/yssk22/hpapp/go/service/errors"
	"github.com/yssk22/hpapp/go/service/schema/enums"
	"github.com/yssk22/hpapp/go/system/slog"
)

type UpsertEventsParams struct {
	FCMemberSha256 string
	UserId         int
	Applications   []EventTicketApplication
}
type EventTicketApplication struct {
	Title                   string
	OpenAt                  *time.Time
	StartAt                 time.Time
	FullyQualifiedVenueName string
	Num                     int
	Status                  enums.HPEventFCTicketStatus
	ApplicationID           *string
	ApplicationStartDate    *time.Time
	ApplicationDueDate      *time.Time
	PaymentStartDate        *time.Time
	PaymentDueDate          *time.Time
}

// UpsertEventsAndApplications upserts the events and their applications
// The information is collected by users' mobile application we split that info into HPEvent and HPFCEventTikect ents.
func UpsertEventsAndApplications(ctx context.Context, params UpsertEventsParams) ([]*ent.HPEvent, error) {
	if params.FCMemberSha256 == "" {
		return nil, fmt.Errorf("member sha256 is empty")
	}
	var events []*ent.HPEvent
	var err error
	var lastUpsertedEvent *ent.HPEvent

	for _, app := range params.Applications {
		if !isSameEvent(lastUpsertedEvent, app.FullyQualifiedVenueName, app.StartAt) {
			lastUpsertedEvent, err = upsertEvent(ctx, app.Title, app.FullyQualifiedVenueName, app.StartAt, app.OpenAt)
			if err != nil {
				// source is not reliable or infrastructure is unstalble now so stop here to iterate.
				return nil, err
			}
			events = append(events, lastUpsertedEvent)
		}
		_, err = upsertFCEventTicket(ctx, upsertFCEventTicketParams{
			EventId:              lastUpsertedEvent.ID,
			UserId:               params.UserId,
			MemberSha256:         params.FCMemberSha256,
			ApplicationTitle:     app.Title,
			Num:                  app.Num,
			Status:               app.Status,
			ApplicationID:        app.ApplicationID,
			ApplicationStartDate: app.ApplicationStartDate,
			ApplicationDueDate:   app.ApplicationDueDate,
			PaymentStartDate:     app.PaymentStartDate,
			PaymentDueDate:       app.PaymentDueDate,
		})
		if err != nil {
			return nil, err
		}
	}
	return events, nil
}

func upsertEvent(ctx context.Context, title string, fqvn string, startAt time.Time, openAt *time.Time) (*ent.HPEvent, error) {
	venue, pref := normalizeVenue(fqvn)
	if pref == "" {
		return nil, errors.New("invalud venue name: no prefecture name is included")
	}
	key := fmt.Sprintf("%s-%s@%d", pref, venue, startAt.Unix())
	client := entutil.NewClient(ctx)
	event, err := client.HPEvent.Query().Where(hpevent.KeyEQ(key)).First(ctx)
	if err = ent.MaskNotFound(err); err != nil {
		return nil, errors.Wrap(ctx, err)
	}
	if event != nil {
		// if event already exists, check DisplayTitles and update it if none exists.
		for _, t := range event.DisplayTitles {
			if t == title {
				return event, nil
			}
		}
		saved, err := event.Update().SetDisplayTitles(append(event.DisplayTitles, title)).Save(ctx)
		return saved, errors.Wrap(ctx, err)
	}
	saved, err := client.HPEvent.Create().
		SetKey(key).
		SetDisplayTitles([]string{title}).
		SetVenue(venue).
		SetStartAt(startAt).
		SetNillableOpenAt(openAt).
		SetPrefecture(pref).
		SetSource(enums.HPEventSourceFCScrape).
		Save(ctx)
	return saved, errors.Wrap(ctx, err)
}

func isSameEvent(event *ent.HPEvent, fqvn string, startAt time.Time) bool {
	if event == nil {
		return false
	}
	venue, pref := normalizeVenue(fqvn)
	if pref == "" {
		return false
	}
	key := fmt.Sprintf("%s-%s@%d", pref, venue, startAt.Unix())
	return event.Key == key
}

type upsertFCEventTicketParams struct {
	EventId              int
	UserId               int
	MemberSha256         string
	ApplicationTitle     string
	Num                  int
	Status               enums.HPEventFCTicketStatus
	ApplicationID        *string
	ApplicationStartDate *time.Time
	ApplicationDueDate   *time.Time
	PaymentStartDate     *time.Time
	PaymentDueDate       *time.Time
}

func upsertFCEventTicket(ctx context.Context, params upsertFCEventTicketParams) (*ent.HPFCEventTicket, error) {
	entclient := entutil.NewClient(ctx)
	submittedTickets, err := entclient.HPFCEventTicket.Query().Where(
		hpfceventticket.HasUserWith(user.IDEQ(params.UserId)),
		hpfceventticket.HasEventWith(hpevent.IDEQ(params.EventId)),
	).All(ctx)
	if err = ent.MaskNotFound(err); err != nil {
		return nil, errors.Wrap(ctx, err, errors.SlogOptions(
			slog.Name("service.helloproject.upfc.upsertFCEventTicket"),
			slog.IncludeStack(),
		))
	}
	// A user can have multiple event applications in a single event (e.g. 先先行 and 先行)
	// so we fetch all applications under the given EventID and and check if ApplicationID already exists or not
	// to determin we need to update the record or create one.
	if len(submittedTickets) > 0 {
		matchedTickets := assert.X(slice.Filter(submittedTickets, func(i int, ticket *ent.HPFCEventTicket) (bool, error) {
			// Note: we didn't have ApplicationID before v2.0 clients so we do compare both ApplicationID and ApplicationTitle
			if params.ApplicationID != nil && ticket.ApplicationID != nil {
				return *params.ApplicationID == *ticket.ApplicationID, nil
			}
			return params.ApplicationTitle == ticket.ApplicationTitle, nil
		}))
		if len(matchedTickets) > 0 {
			ticket := matchedTickets[0]
			update := ticket.Update()
			shouldUpdate := false
			// if some field is changed, then execute update.
			if params.Status != ticket.Status {
				shouldUpdate = true
				update.SetStatus(params.Status)
			}
			if params.ApplicationStartDate != nil && isDateChanged(params.ApplicationStartDate, ticket.ApplicationStartDate) {
				shouldUpdate = true
				update.SetNillableApplicationStartDate(params.ApplicationStartDate)
			}
			if params.ApplicationDueDate != nil && isDateChanged(params.ApplicationDueDate, ticket.ApplicationDueDate) {
				shouldUpdate = true
				update.SetNillableApplicationDueDate(params.ApplicationDueDate)
			}
			if params.PaymentStartDate != nil && isDateChanged(params.PaymentStartDate, ticket.PaymentStartDate) {
				shouldUpdate = true
				update.SetNillablePaymentStartDate(params.PaymentStartDate)
			}
			if params.PaymentDueDate != nil && isDateChanged(params.PaymentDueDate, ticket.PaymentDueDate) {
				shouldUpdate = true
				update.SetNillablePaymentDueDate(params.PaymentDueDate)
			}
			if params.ApplicationID != nil && ticket.ApplicationID == nil {
				shouldUpdate = true
				update.SetNillableApplicationID(params.ApplicationID)
			}
			if shouldUpdate {
				update.SetOwnerUserID(ticket.OwnerUserID) // ensure to pass the policy
				return update.Save(ctx)
			}
			return ticket, nil
		}
	}
	// create a new
	created, err := entclient.HPFCEventTicket.Create().
		SetOwnerUserID(params.UserId).
		SetEventID(params.EventId).
		SetFcMemberSha256(params.MemberSha256).
		SetApplicationTitle(params.ApplicationTitle).
		SetNillableApplicationID(params.ApplicationID).
		SetNum(params.Num).
		SetStatus(params.Status).
		SetNillableApplicationStartDate(params.ApplicationStartDate).
		SetNillableApplicationDueDate(params.ApplicationDueDate).
		SetNillablePaymentStartDate(params.PaymentStartDate).
		SetNillablePaymentDueDate(params.PaymentDueDate).
		Save(ctx)
	return created, errors.Wrap(ctx, err, errors.SlogOptions(
		slog.Name("service.helloproject.upfc.upsertFCEventTicket"),
		slog.IncludeStack(),
	))

}

func isDateChanged(a *time.Time, b *time.Time) bool {
	if a == nil {
		return b != nil
	}
	if b == nil {
		return true
	}
	return !a.Equal(*b)
}
