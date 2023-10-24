#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const package = require(path.join(__dirname, "..", "package.json"));

const version = package.hpapp.graphql_version;

const dst = path.join(__dirname, "..", "generated", "schema.graphql");
const src = path.join(__dirname, "..", "..", "go", "graphql", version);

const entSchema = fs
  .readFileSync(path.join(src, "generated", "ent.graphql"))
  .toString();
const appSchema = fs
  .readFileSync(path.join(src, "generated", "schema.graphql"))
  .toString();
const commonSchema = fs
  .readFileSync(path.join(src, version + ".graphql"))
  .toString();

querySchemaEnt = entSchema.match(/type\s+Query\s+{([^}]+)}/)[1];
querySchemaCommon = commonSchema.match(/type\s+Query\s+{([^}]+)}/)[1];

const fd = fs.openSync(dst, "w");
fs.writeSync(fd, entSchema);
fs.writeSync(fd, appSchema);
fs.writeSync(
  fd,
  // HACK:
  //    DO NOT extend type Query as it is interpreted as client schema instead of server schema by relay-compiler.
  //    see also https://relay.dev/docs/guides/client-schema-extensions/
  //
  //    there should be one Query definition in entSchema, and one extend Query defition from the app and we have to merge it into one Query type.
  //
  commonSchema.toString().replace(/extend type Query/, "type Query")
);
fs.writeSync(fd, "type Query {\n" + querySchemaEnt + querySchemaCommon + "}\n");
fs.close(fd);
