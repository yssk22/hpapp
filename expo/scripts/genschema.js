#!/usr/bin/env node
const {
  makeExecutableSchema,
  mergeSchemas,
  printSchema,
} = require("@graphql-tools/schema");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs, printMergedTypeDefs } = require("@graphql-tools/merge");
const { print } = require("graphql");
const fs = require("fs");
const path = require("path");
const package = require(path.join(__dirname, "..", "package.json"));

const version = package.hpapp.graphql_version;

const src = path.join(__dirname, "..", "..", "go", "graphql", version);
const typesArray = loadFilesSync(src);
const mergedSchema = mergeTypeDefs(typesArray);
const schemaString = print(mergedSchema);
const dst = path.join(__dirname, "..", "generated", "schema.graphql");

fs.writeFileSync(dst, schemaString);
