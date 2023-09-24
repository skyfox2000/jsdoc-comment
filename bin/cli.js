#!/usr/bin/env node

const packageJson = require("../package.json");
const { program } = require("commander");
const { readConfig, scanComponents } = require("../src/index.js");

program.version(packageJson.version).description(packageJson.description);

program
   .option("-c, --config <path>", "Specify the config file path")

program.parse(process.argv);

const { path: filePath } = program;

const config = readConfig(filePath);
scanComponents(config);