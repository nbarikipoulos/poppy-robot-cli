/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

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
 * Note it re-exports all the exported features of the poppy-robot-core module.
 *
 * @module poppy-robot-cli
 * @typicalname P
 * @version 3.0.0
 * @see {@link https://github.com/nbarikipoulos/poppy-robot-core.git}
 */

'use strict'

const yargs = require('yargs')

const cliOptions = require('./cli/cli-options')
const OptionHelper = cliOptions.OptionHelper
const getPoppyConfiguration = cliOptions.getPoppyConfiguration

const core = require('poppy-robot-core')
const Script = core.Script
const Poppy = core.Poppy
const ExtMotorRequest = core.ExtMotorRequest
const RawMotorRequest = core.ExtMotorRequest
const PoppyRequestHandler = core.PoppyRequestHandler

// ////////////////////////////////
// Automatically add CLI options for
// Poppy configuration to any script
// ////////////////////////////////

yargs
  .locale('en')
  .alias('h', 'help')
  .help('h')

const optionHelper = new OptionHelper()
optionHelper.addPoppyConfigurationOptions(yargs)

yargs
  .wrap(yargs.terminalWidth())
  .argv

// ////////////////////////////////
// Main object factories
// ////////////////////////////////

const createPoppy = (options) => {
  // First let's obtain the configuration
  const config = Object.assign({},
    getPoppyConfiguration(yargs.argv), // read from .poppyrc and CLI
    options // from arguments
  )

  return core.createPoppy(config)
}

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  createPoppy,
  createScript: core.createScript,
  Script,
  Poppy,
  ExtMotorRequest,
  RawMotorRequest,
  PoppyRequestHandler
}
