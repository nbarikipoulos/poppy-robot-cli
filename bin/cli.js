#!/usr/bin/env node

/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const yargs = require('yargs')

const cliBuilderHelper = require('../cli/cli-helper')
const init = cliBuilderHelper.init

const epilogue = 'Poppy CLI. (c)2018-2019 N. Barriquand. Released under the MIT license.\n' +
  'More details on http://github.com/nbarikipoulos/poppy-robot-cli'

// ////////////////////////////////
// ////////////////////////////////
// Main help
// ////////////////////////////////
// ////////////////////////////////

yargs
  .usage('Usage: $0 <command> --help for detailed help')
  .demandCommand(1, 'Use at least one command')
  .epilogue(epilogue)
  .locale('en')
  .version()
  .alias('h', 'help')
  .help('h')
  .showHelpOnFail(true)

// ////////////////////////////////
// ////////////////////////////////
// "Main" job :)
// ////////////////////////////////
// ////////////////////////////////

init().then(_ => {
  buildCLI()
  parse()
})

// ////////////////////////////////
// ////////////////////////////////
// private
// ////////////////////////////////
// ////////////////////////////////

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
