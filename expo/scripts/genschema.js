#!/usr/bin/env node
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const fs = require('fs');
const { print } = require('graphql');
const path = require('path');
const pkg = require(path.join(__dirname, '..', 'package.json'));

const version = pkg.hpapp.graphql_version;

const src = path.join(__dirname, '..', '..', 'go', 'graphql', version);
const typesArray = loadFilesSync(src);
const mergedSchema = mergeTypeDefs(typesArray);
const schemaString = print(mergedSchema);
const dst = path.join(__dirname, '..', 'generated', 'schema.graphql');

fs.writeFileSync(dst, schemaString);
