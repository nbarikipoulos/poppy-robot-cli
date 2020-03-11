/*! Copyright (c) 2018-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

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
 * -i/--ip | Set the Poppy IP/hostname | string | poppy.local
 * -p/--http-port | Set the http server port on Poppy | integer | 8080
 * -P/--snap-port | Set the snap server port on Poppy | integer | 6969
 *
 * Note it re-exports all the exported features of interest of the poppy-robot-core module.
 *
 * @module poppy-robot-cli
 * @typicalname P
 * @version 5.0.3
 * @see {@link https://github.com/nbarikipoulos/poppy-robot-core.git}
 */

'use strict'

const yargs = require('yargs')

const core = require('poppy-robot-core')

const cliBuilderHelper = require('./cli/cli-helper')
const createPoppy = require('./lib/ext-poppy-factory')

// ////////////////////////////////
// Automatically add CLI options for
// Poppy configuration to any script
// ////////////////////////////////

yargs
  .locale('en')
  .alias('h', 'help')
  .help('h')

// Add common cli options for poppy settings
cliBuilderHelper.addPoppyConnectionOptions()

yargs
  .wrap(yargs.terminalWidth())
  .parse()

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  createPoppy, // overriden by this module
  createScript: core.createScript,
  createDescriptor: core.createDescriptor,
  Script: core.Script,
  Poppy: core.Poppy,
  ExtMotorRequest: core.ExtMotorRequest,
  RawMotorRequest: core.RawMotorRequest,
  PoppyRequestHandler: core.PoppyRequestHandler
}
