package errors

import (
	"fmt"
	"testing"
)

func TestMultiError(t *testing.T) {
	tests := []struct {
		name    string
		me      MultiError
		wantErr bool
	}{
		{
			name:    "no errors",
			me:      []error{},
			wantErr: false,
		},
		{
			name:    "all errors",
			me:      []error{fmt.Errorf("error")},
			wantErr: true,
		},
		{
			name:    "some errors",
			me:      []error{nil, fmt.Errorf("error"), fmt.Errorf("error")},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if hasError := tt.me.HasError(); tt.wantErr != hasError {
				t.Errorf("MultiError.HasError() %v, wantErr %v", hasError, tt.wantErr)
			}
			if err := tt.me.ToReturn(); (err != nil) != tt.wantErr {
				t.Errorf("MultiError.ToReturn() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
