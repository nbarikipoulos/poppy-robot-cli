/**
 * This module is a simple wrapper of the poppy-robot-core module in order to:
 *
 *  - Automatically manage a set of common flags dedicated to robot connections via node cli,
 *  - Read poppy rc file created neither by hand or using the cli tool.
 *
 * The flags in order to set the connection to poppy:
 *
 * option | desc | value | default
 * --- | --- | --- | ---
 * -H/--host | Set the Poppy IP/hostname | string | poppy.local
 * -p/--port | Set the port to the REST API served by the http server on Poppy | integer | 8080
 *
 * Note it re-exports all the exported features of interest of the poppy-robot-core module.
 *
 * @module poppy-robot-cli
 * @typicalname P
 * @version 11.0.0
 * @see {@link https://github.com/nbarikipoulos/poppy-robot-core.git}
 */

'use strict'

const yargs = require('yargs')

const {
  createScript, Script, Poppy,
  ExtMotorRequest, RawMotorRequest, PoppyRequestHandler
} = require('poppy-robot-core')

const { addConnectionOptionsGroup } = require('./cli/cli-helper')
const { createPoppy, createRequestHandler, createDescriptor } = require('./lib/ext-poppy-factory')

// ////////////////////////////////
// Automatically add CLI options for
// Poppy configuration to any script
// ////////////////////////////////

yargs
  .locale('en')
  .alias('h', 'help')
  .help('h')

// Add common cli options for poppy settings
addConnectionOptionsGroup()

yargs
  .wrap(yargs.terminalWidth())
  .parse()

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  createPoppy,
  createRequestHandler,
  createScript,
  createDescriptor,
  Script,
  Poppy,
  ExtMotorRequest,
  RawMotorRequest,
  PoppyRequestHandler
}
