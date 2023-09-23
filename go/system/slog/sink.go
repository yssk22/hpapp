package slog

import (
	"context"
	"fmt"
	"io"

	"cloud.google.com/go/logging"
	"hpapp.yssk22.dev/go/foundation/errors"
)

// Sink is an interface to implement logging sink
type Sink interface {
	Write(*Record) error
	Flush() error
	Close() error
}

type nullLSink struct{}

func (*nullLSink) Write(*Record) error {
	return nil
}

func (*nullLSink) Flush() error {
	return nil
}

func (*nullLSink) Close() error {
	return nil
}

// NewNullSink returns a Sink that does nothing
func NewNullSink() Sink {
	return &nullLSink{}
}

type memorySink struct {
	records []*Record
}

func (s *memorySink) Write(r *Record) error {
	s.records = append(s.records, r)
	return nil
}

func (s *memorySink) Flush() error {
	return nil
}

func (s *memorySink) Close() error {
	return nil
}

// NewMemorySink returns a Sink that does keep log records in memory
func NewMemorySink() Sink {
	return &memorySink{}
}

type ioSink struct {
	w io.Writer
	f Formatter
}

func (s *ioSink) Write(r *Record) error {
	buff, err := s.f.Format(r)
	if err != nil {
		return err
	}
	_, err = s.w.Write(buff)
	return err
}

func (s *ioSink) Flush() error {
	flushable, ok := s.w.(interface {
		Flush() error
	})
	if ok {
		return flushable.Flush()
	}
	return nil
}

func (s *ioSink) Close() error {
	closeable, ok := s.w.(io.Closer)
	if ok {
		return closeable.Close()
	}
	return nil
}

// NewIOSink returns a Sink that writes log records to an io.Writer using a Formatter
func NewIOSink(w io.Writer, f Formatter) Sink {
	return &ioSink{w, f}
}

type gcpSink struct {
	client *logging.Client
	logger *logging.Logger
}

// NewGCPSink retrns a Sink for GCP environment. It uses Cloud Logging API to output structured log records.
func NewGCPSink(ctx context.Context, projectID string, logID string) (Sink, error) {
	client, err := logging.NewClient(ctx, projectID)
	if err != nil {
		return nil, err
	}
	return &gcpSink{
		client: client,
		logger: client.Logger(logID),
	}, nil
}

func (s *gcpSink) Write(r *Record) error {
	payload := make(map[string]interface{})
	if r.Attributes != nil {
		for key, value := range r.Attributes {
			payload[key] = value
		}
	}
	payload["message"] = r.Message
	payload["context"] = r.ContextInstance
	if r.Stack != nil {
		payload["stack"] = r.Stack
	}
	s.logger.Log(logging.Entry{
		Timestamp: r.Timestamp,
		Severity:  gcpSeverityMapping[r.Severity],
		Payload:   payload,
		Labels: map[string]string{
			"event_name":   r.Name,
			"event_source": fmt.Sprintf("%s:%d", r.SourcePath, r.SourceLine),
			"severity":     string(r.Severity),
		},
	})
	return nil
}

func (s *gcpSink) Flush() error {
	return s.logger.Flush()
}

func (s *gcpSink) Close() error {
	var errs []error
	if err := s.logger.Flush(); err != nil {
		errs = append(errs, err)
	}
	if err := s.client.Close(); err != nil {
		errs = append(errs, err)
	}
	return errors.MultiError(errs).ToReturn()
}

var gcpSeverityMapping = map[Severity]logging.Severity{
	SeverityCritical: logging.Critical,
	SeverityDebug:    logging.Debug,
	SeverityError:    logging.Error,
	SeverityWarning:  logging.Warning,
	SeverityInfo:     logging.Info,
}

func NewEventFilter(events []string, s Sink) Sink {
	return &eventsFilter{
		events: events,
		s:      s,
	}
}

type eventsFilter struct {
	events []string
	s      Sink
}

func (s *eventsFilter) Write(r *Record) error {
	for _, e := range s.events {
		if r.Name == e {
			return s.s.Write(r)
		}
	}
	return nil
}

func (s *eventsFilter) Flush() error {
	return s.s.Flush()
}

func (s *eventsFilter) Close() error {
	return s.s.Close()
}
