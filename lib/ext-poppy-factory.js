/*! Copyright (c) 2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

/**
 * Simple wrapper of the poppy factory provided by the poppy-robot-core module
 * in order to automatically appends user's settings from both poppyrc file and CLI.
 * Overriding order of settings is: poppyrc <- cli flags <- factory arguments
 */

'use strict'

const core = require('poppy-robot-core')

const cliBuilderHelper = require('../cli/cli-helper')

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = async (options = {}) => {
  // First let's obtain the configuration from
  // poppyrc file, if any, CLI, and user's arguments
  const config = Object.assign(
    {},
    cliBuilderHelper.getPoppyConfiguration(),
    options
  )

  // And then, instantiate and return a Poppy object
  return core.createPoppy(config)
}
