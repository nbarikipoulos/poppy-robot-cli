#!/usr/bin/env node

'use strict'

const yargs = require('yargs')

const { version } = require('../package.json')

const commands = require('../cli/commands')
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

  // Add commands
  for (const command of commands) {
    yargs.command(
      command.cmd,
      command.desc,
      command.builder,
      command.handler
    )
  }
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
