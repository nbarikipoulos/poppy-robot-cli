#!/usr/bin/env node

/*! Copyright (c) 2018-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const yargs = require('yargs')

const { version } = require('../package.json')

const { init, addPoppyConnectionOptions } = require('../cli/cli-helper')
const { prettifyError: prettify } = require('../lib/utils')

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
  .scriptName('poppy')
  .usage('Usage: $0 <command> --help for detailed help')
  .demandCommand(1, 'Use at least one command')
  .locale('en')
  .version(version)
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
  addPoppyConnectionOptions()

  // Add executing command
  require('../cli/commands/exec-commands')()

  // Add querying robot commands
  require('../cli/commands/query-commands')()

  // Add Configuration/Discovering robot commands
  require('../cli/commands/config-command')()

  // "Admin" commands (api start/stop, reboot, etc.)
  require('../cli/commands/admin-commands')()
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
