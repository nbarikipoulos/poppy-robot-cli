#!/usr/bin/env node

/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const Poppy = require('poppy-robot-core').Poppy

const cliBuilderHelper = require('../cli/cli-helper')
const yargs = cliBuilderHelper.yargs

const epilogue = 'Poppy CLI. (c)2018-2019 N. Barriquand. Released under the MIT license.\n' +
  'More details on http://github.com/nbarikipoulos/poppy-robot-cli'

// ////////////////////////////////
// ////////////////////////////////
// Instantiate a Poppy object to
// get its configuration.
// ////////////////////////////////
// ////////////////////////////////

let poppy

try {
  const config = cliBuilderHelper.getPoppyConfiguration(yargs.argv)
  poppy = new Poppy(config)
} catch (error) {
  console.log('Unable to create Poppy object:')
  console.log(error.message)
  process.exit(-1) // without any poppy instance, nothing is possible
}

// And then, instantiate helper for CLI use which need a Poppy instance
// to dynamically fill the motor options with motor ids.
cliBuilderHelper.init(poppy)

// ////////////////////////////////
// ////////////////////////////////
// Main help
// ////////////////////////////////
// ////////////////////////////////

yargs
  .usage('Usage: $0 <command> --help for detailed help')
  .demandCommand(1, 'Use at least one command')
  .strict()
  .epilogue(epilogue)
  .locale('en')
  .version()
  .alias('h', 'help')
  .help('h')
  .showHelpOnFail(true)

// ////////////////////////////////
// ////////////////////////////////
// Add executing command
// ////////////////////////////////
// ////////////////////////////////

require('../cli/exec-commands')(poppy)

// ////////////////////////////////
// ////////////////////////////////
// Add querying robot commands
// ////////////////////////////////
// ////////////////////////////////

require('../cli/query-commands')(poppy)

// ////////////////////////////////
// ////////////////////////////////
// Add Configuration/Discovering robot commands
// ////////////////////////////////
// ////////////////////////////////

require('../cli/config-command')(poppy)

// ////////////////////////////////
// ////////////////////////////////
// "Main" job :)
// ////////////////////////////////
// ////////////////////////////////

yargs
  .wrap(yargs.terminalWidth())
  .argv
