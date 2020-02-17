#!/usr/bin/env node

/*! Copyright (c) 2018-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const yargs = require('yargs')

const cliBuilderHelper = require('../cli/cli-helper')
const init = cliBuilderHelper.init
const prettify = require('../lib/utils').prettifyError

const epilogue = 'Poppy CLI. (c)2018-2020 N. Barriquand. Released under the MIT license.\n' +
  'More details on http://github.com/nbarikipoulos/poppy-robot-cli'

// ////////////////////////////////
// ////////////////////////////////
// Main job
// ////////////////////////////////
// ////////////////////////////////

init()
  .catch(console.log)
  .then(_ => {
    buildCLI()
    help()
    parse()
  })

// ////////////////////////////////
// ////////////////////////////////
// private
// ////////////////////////////////
// ////////////////////////////////

const help = _ => yargs
  .usage('Usage: $0 <command> --help for detailed help')
  .demandCommand(1, 'Use at least one command')
  .epilogue(epilogue)
  .locale('en')
  .version()
  .alias('h', 'help')
  .help('h')
  .fail((message, error, yargs) => {
    if (error) { // Something is rotten in my poppy...
      console.log(error.message)
    }
    if (message) { // ... or in cli parsing
      console.log(yargs.help())
      console.log(prettify('error', message))
    }
    process.exit(1)
  })

const buildCLI = _ => {
  // Add common cli options for poppy settings
  cliBuilderHelper.addPoppyConnectionOptions()

  // Add executing command
  require('../cli/commands/exec-commands')()

  // Add querying robot commands
  require('../cli/commands/query-commands')()

  // Add Configuration/Discovering robot commands
  require('../cli/commands/config-command')()
}

// ////////////////////////////////
// Parse cli
// ////////////////////////////////

const parse = _ => {
  yargs
    .wrap(yargs.terminalWidth())
    .strict()
    .parse()
}
