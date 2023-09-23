#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const package = require(path.join(__dirname, "..", "package.json"));

const version = package.hpapp.graphql_version;

const dst = path.join(__dirname, "..", "generated", "schema.graphql");
const src = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "..",
  "hpapp.yssk22.dev",
  "go",
  "graphql",
  version
);

const entSchema = fs.readFileSync(path.join(src, "generated", "ent.graphql"));
const appSchema = fs.readFileSync(
  path.join(src, "generated", "schema.graphql")
);
const commonSchema = fs.readFileSync(path.join(src, version + ".graphql"));

const fd = fs.openSync(dst, "w");
fs.writeSync(fd, entSchema);
fs.writeSync(fd, appSchema);
fs.writeSync(
  fd,
  // HACK:
  //    DO NOT extend type Query as it is interpreted as client schema instead of server schema by relay-compiler.
  //    see also https://relay.dev/docs/guides/client-schema-extensions/
  commonSchema.toString().replace(/extend type Query/, "type Query")
);
fs.close(fd);
