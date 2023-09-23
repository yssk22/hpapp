package assert

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"

	diff "github.com/yudai/gojsondiff"
	"github.com/yudai/gojsondiff/formatter"
)

type snapshot struct {
	Value interface{} `json:"value"`
}

// generateSnapshotOrCompare generates a snapshot file if it does not exist, otherwise parse the snapshot file and compare the value with `v`.
func generateSnapshotOrCompare(path string, v interface{}, options ...SnapshotOption) error {
	gen := &snapshotGenerator{}
	for _, o := range options {
		gen = o(gen)
	}
	gotTarget, err := gen.Generate(v)
	if err != nil {
		return err
	}
	dir := filepath.Dir(path)
	_, err = os.Stat(path)
	if err != nil {
		if !os.IsNotExist(err) {
			return fmt.Errorf("cannot stat a snapshot file: %w", err)
		}
		// create a snapshot file
		if err = os.MkdirAll(dir, 0755); err != nil {
			return fmt.Errorf("cannot create a snapshot dir: %w", err)
		}
		w, err := os.OpenFile(path, os.O_CREATE|os.O_RDWR, 0644)
		if err != nil {
			return fmt.Errorf("cannot create a snapshot file: %w", err)
		}
		defer w.Close()
		encoder := json.NewEncoder(w)
		encoder.SetIndent("", "  ")
		if err = encoder.Encode(snapshot{Value: v}); err != nil {
			return fmt.Errorf("cannot encode the snapshot object to json: %w", err)
		}
		return nil
	}
	r, err := os.OpenFile(path, os.O_RDONLY, 0644)
	if err != nil {
		return fmt.Errorf("cannot open a json snapshot file: %w", err)
	}
	defer r.Close()
	var s snapshot
	snapshotBin, err := ioutil.ReadAll(r)
	if err != nil {
		return fmt.Errorf("cannot open a json snapshot file: %w", err)
	}
	if err = json.Unmarshal(snapshotBin, &s); err != nil {
		return fmt.Errorf("cannot read a json snapshot file: %w", err)
	}
	snapshotTarget, err := gen.Generate(s.Value)
	if err != nil {
		return err
	}
	expectedBin, _ := json.Marshal(snapshot{Value: snapshotTarget})
	gotBin, err := json.Marshal(snapshot{Value: gotTarget})
	if err != nil {
		return fmt.Errorf("cannot open a json snapshot file: %w", err)
	}
	differ := diff.New()
	d, err := differ.Compare(expectedBin, gotBin)
	if err != nil {
		return fmt.Errorf("cannot compare jsons: %w", err)
	}
	if d.Modified() {
		var expectedJSON map[string]interface{}
		err := json.Unmarshal(expectedBin, &expectedJSON)
		if err != nil {
			return fmt.Errorf("cannot decode expected json: %w", err)
		}
		f := formatter.NewAsciiFormatter(expectedJSON, formatter.AsciiFormatterConfig{
			ShowArrayIndex: true,
			Coloring:       false,
		})
		delta, err := f.Format(d)
		if err != nil {
			return fmt.Errorf("cannot get snapshot delta: %w", err)
		}
		return fmt.Errorf("snapshot has a delta: %v", delta)
	}
	return nil
}

type snapshotGenerator struct {
	excludeFields []string
}

func (gen *snapshotGenerator) Generate(v interface{}) (interface{}, error) {
	buff, err := json.Marshal(v)
	if err != nil {
		return nil, fmt.Errorf("cannot generate a snapshot: %w", err)
	}
	vv := make(map[string]interface{})
	if err = json.Unmarshal(buff, &vv); err != nil {
		// it's not map[string]iterface{} type, so just use v.
		return v, nil
	}
	// apply excludeFields
	gen.deleteExcludedFields(vv)
	// for _, f := range gen.excludeFields {
	// 	delete(vv, f)
	// }
	return vv, nil
}

func (gen *snapshotGenerator) deleteExcludedFields(v interface{}) {
	vv, ok := v.(map[string]interface{})
	if !ok {
		aa, ok := v.([]interface{})
		if !ok {
			return
		}
		for _, a := range aa {
			gen.deleteExcludedFields(a)
		}
		return
	}
	for _, f := range gen.excludeFields {
		delete(vv, f)
	}
	for _, vvv := range vv {
		gen.deleteExcludedFields(vvv)
	}
}

type SnapshotOption func(*snapshotGenerator) *snapshotGenerator

// SnapshotExclude excludes fields from a snapshot so that the comparison is not affected by the fields.
func SnapshotExclude(fields ...string) SnapshotOption {
	return func(gen *snapshotGenerator) *snapshotGenerator {
		gen.excludeFields = append(gen.excludeFields, fields...)
		return gen
	}
}
