package test

import (
	"bytes"
	"context"
	"testing"
	"time"

	"hpapp.yssk22.dev/go/foundation/assert"
	"hpapp.yssk22.dev/go/foundation/errors"
	"hpapp.yssk22.dev/go/service/bootstrap/test"
	"hpapp.yssk22.dev/go/service/entutil"
	"hpapp.yssk22.dev/go/service/schema/jsonfields"
)

func TestExportAndImport(t *testing.T) {
	test.New("default values").Run(t, func(ctx context.Context, t *testing.T) {
		var buff bytes.Buffer
		a := assert.NewTestAssert(t)
		entclient := entutil.NewClient(ctx)

		record := entclient.TestEnt.Create().SaveX(ctx)
		a.Equals("test_string", *record.StringField)
		a.Equals("test_text", *record.TextField)
		a.Equals("test_bytes", string(*record.BytesField))
		a.Equals(true, *record.BoolField)
		a.Equals(time.Date(1996, 10, 30, 1, 2, 3, 4, time.UTC), *record.TimeField)
		a.Equals(10, *(record.IntField))
		a.Equals(int64(30), *(record.Int64Field))
		a.Equals(19.96, *record.FloatField)
		a.Equals(&jsonfields.TestJSON{
			String:   "string_field",
			Int:      10,
			DateTime: time.Date(1996, 10, 30, 1, 2, 3, 4, time.UTC),
		}, record.JSONField)
		a.Equals(1, entclient.TestEnt.Query().CountX(ctx))

		err := entutil.ExportTable(ctx, &buff, "test_ents")
		a.Nil(err)
		entclient.TestEnt.DeleteOne(record).ExecX(ctx)
		a.Equals(0, entclient.TestEnt.Query().CountX(ctx))

		err = entutil.ImportTable(ctx, &buff, "test_ents")
		a.Nil(err)
		a.Equals(1, entclient.TestEnt.Query().CountX(ctx))

		imported := entclient.TestEnt.Query().FirstX(ctx)
		a.Equals(record.StringField, imported.StringField)
		a.Equals(record.TextField, imported.TextField)
		a.Equals(record.BytesField, imported.BytesField)
		a.Equals(record.BoolField, imported.BoolField)
		a.Equals(record.TimeField, imported.TimeField)
		a.Equals(record.IntField, imported.IntField)
		a.Equals(record.Int64Field, imported.Int64Field)
		a.Equals(record.FloatField, imported.FloatField)
		a.Equals(record.JSONField, imported.JSONField)
		a.Equals(record.EnumField, imported.EnumField)

		// ent ID sequential should work even after being imported
		one, err := entclient.TestEnt.Create().Save(ctx)
		a.Nil(err)
		a.Equals(imported.ID, one.ID-1)
	})

	test.New("null values").Run(t, func(ctx context.Context, t *testing.T) {
		var buff bytes.Buffer
		a := assert.NewTestAssert(t)
		entclient := entutil.NewClient(ctx)
		record := entclient.TestEnt.Create().SaveX(ctx)
		record = record.Update().
			ClearStringField().
			ClearTextField().
			ClearBytesField().
			ClearBoolField().
			ClearTimeField().
			ClearIntField().
			ClearInt64Field().
			ClearFloatField().
			ClearJSONField().
			SaveX(ctx)

		a.Nil(record.StringField)
		a.Nil(record.TextField)
		a.Nil(*record.BytesField)
		a.Nil(record.BoolField)
		a.Nil(record.TimeField)
		a.Nil(record.IntField)
		a.Nil(record.Int64Field)
		a.Nil(record.FloatField)
		a.Nil(record.JSONField)

		err := entutil.ExportTable(ctx, &buff, "test_ents")
		a.Nil(err)
		entclient.TestEnt.DeleteOne(record).ExecX(ctx)
		a.Equals(0, entclient.TestEnt.Query().CountX(ctx))

		err = entutil.ImportTable(ctx, &buff, "test_ents")
		a.Nil(err)
		a.Equals(1, entclient.TestEnt.Query().CountX(ctx))

		imported := entclient.TestEnt.Query().FirstX(ctx)
		a.Nil(imported.StringField)
		a.Nil(imported.TextField)
		a.Nil(*imported.BytesField) // BytesField always returns an object but []bytes could be nil if the source is NULL.
		a.Nil(imported.BoolField)
		a.Nil(imported.TimeField)
		a.Nil(imported.IntField)
		a.Nil(imported.Int64Field)
		a.Nil(imported.FloatField)
		a.Nil(imported.JSONField)
	})

	test.New("duplicate imports").Run(t, func(ctx context.Context, t *testing.T) {
		var buff bytes.Buffer
		a := assert.NewTestAssert(t)
		entclient := entutil.NewClient(ctx)
		entclient.TestEnt.Create().SaveX(ctx)

		err := entutil.ExportTable(ctx, &buff, "test_ents")
		a.Nil(err)
		err = entutil.ImportTable(ctx, &buff, "test_ents")
		a.NotNil(err)
		a.Equals("UNIQUE constraint failed: test_ents.id", errors.Unwrap(err.(errors.MultiError).Get(0)).Error())
	})
}
