package entutil

import (
	"context"
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/yssk22/hpapp/go/foundation/errors"
	"github.com/yssk22/hpapp/go/foundation/slice"
	"github.com/yssk22/hpapp/go/system/database"
	"github.com/yssk22/hpapp/go/system/slog"
)

var (
	ErrExportFileNotFound = fmt.Errorf("export file is not found")
	ErrImportNotSupported = fmt.Errorf("import is only supported for sqlite3")
)

// ExportTable exports a SQL table to writer with CSV format.
// table name must not be derived from user input as it can cause SQL injection
func ExportTable(ctx context.Context, w io.Writer, table string) error {
	db := database.FromContext(ctx).DB
	csvw := csv.NewWriter(w)
	defer csvw.Flush()
	rows, err := db.QueryContext(ctx, fmt.Sprintf("SELECT * FROM `%s`", table))
	if err != nil {
		return err
	}
	columns, err := rows.Columns()
	if err != nil {
		return err
	}
	err = csvw.Write(columns)
	if err != nil {
		return err
	}
	values := make([]interface{}, len(columns))
	valuePtrs := make([]interface{}, len(columns))
	for rows.Next() {
		for i := range columns {
			valuePtrs[i] = &values[i]
		}
		err = rows.Scan(valuePtrs...)
		if err != nil {
			return err
		}
		stringValues := make([]string, len(columns))
		for i, v := range values {
			switch vv := v.(type) {
			case []byte:
				stringValues[i] = string(vv)
			case time.Time:
				stringValues[i] = vv.Format(time.RFC3339Nano)
			default:
				stringValues[i] = fmt.Sprintf("%v", v)
			}
		}
		err = csvw.Write(stringValues)
		if err != nil {
			return err
		}
	}
	return nil
}

func ImportTable(ctx context.Context, r io.Reader, table string) error {
	dbinfo := database.FromContext(ctx)
	if dbinfo.Name != "sqlite3" {
		return ErrImportNotSupported
	}
	db := dbinfo.DB
	availableColumns, err := getColumnNamesFromDatabase(ctx, table)
	if err != nil {
		return fmt.Errorf("cannot get the available columns for %s: %w", table, err)
	}
	csvr := csv.NewReader(r)
	columns, err := csvr.Read()
	if err != nil {
		return fmt.Errorf("cannot read the header row: %w", err)
	}
	insertColumns, _ := slice.Filter(columns, func(_ int, v string) (bool, error) {
		if slice.Index(availableColumns, v) == -1 {
			slog.Warning(ctx,
				fmt.Sprintf(
					"column %s is not avaiable in the current Ent schema (%q), not imported",
					v, table,
				),
				slog.Name("service.entutil.import_table"),
				slog.Attribute("table", table),
				slog.Attribute("column", v),
			)
			return false, nil
		}
		return true, nil
	})
	placeholders, _ := slice.Map(insertColumns, func(_ int, _ string) (string, error) {
		return "?", nil
	})
	statementString := fmt.Sprintf( //nolint - table name must not be from user inputs and placeholders are all "?"
		"INSERT INTO %s (`%s`) VALUES(%s)",
		table,
		strings.Join(insertColumns, "`, `"),
		strings.Join(placeholders, ","),
	)
	stmt, err := db.PrepareContext(ctx, statementString)
	if err != nil {
		return err
	}
	defer stmt.Close()
	var errs []error
	for {
		row, err := csvr.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return err
		}
		// skip id column
		var values []any
		for i, v := range row {
			if slice.Index(availableColumns, columns[i]) == -1 {
				continue
			}
			t, err := time.Parse(time.RFC3339Nano, v)
			if err == nil {
				values = append(values, t)
			} else if v == "<nil>" {
				values = append(values, nil)
			} else {
				values = append(values, v)
			}
		}
		_, err = stmt.ExecContext(ctx, values...)
		if err != nil {
			err = fmt.Errorf("cannot insert row %q: %w", row, err)
		}
		errs = append(errs, err)
	}
	return errors.MultiError(errs).ToReturn()
}

func getColumnNamesFromDatabase(ctx context.Context, table string) ([]string, error) {
	db := database.FromContext(ctx).DB
	rows, err := db.QueryContext(ctx, fmt.Sprintf("SELECT * FROM `%s` LIMIT 1", table))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return rows.Columns()
}

func FindExportFile(ctx context.Context, dir string, fileName string) (string, error) {
	absDir, err := filepath.Abs(dir)
	if err != nil {
		return "", err
	}
	name := filepath.Join(absDir, fileName)
	_, err = os.Stat(name)
	if err != nil {
		if os.IsNotExist(err) {
			parent := filepath.Join(absDir, "..")
			absParent, _ := filepath.Abs(parent)
			if absDir == absParent {
				return "", ErrExportFileNotFound
			}
			return FindExportFile(ctx, filepath.Join(absDir, ".."), fileName)
		} else {
			return "", err
		}
	}
	return name, nil
}
