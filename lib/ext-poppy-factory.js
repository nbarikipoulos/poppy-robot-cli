/**
 * Simple wrapper of the poppy and request handler factories provided by the poppy-robot-core module
 * in order to automatically appends user's settings from both poppyrc file and CLI.
 * Overriding order of settings is: poppyrc <- cli flags <- default arguments
 */

'use strict'

const {
  createPoppy: coreCreatePoppy,
  createRequestHandler: coreCreateRequesHandler,
  createDescriptor: coreCreateDescriptor
} = require('poppy-robot-core')

const { configObject } = require('../cli/cli-helper')

const error = (err) => {
  throw new Error(configObject.toString(), { cause: err })
}

const createPoppy = (config) => coreCreatePoppy(configObject.getSettings(config)).catch(error)
const createRequestHandler = (config) => coreCreateRequesHandler(configObject.getSettings(config)).catch(error)
const createDescriptor = (config) => coreCreateDescriptor(configObject.getSettings(config)).catch(error)

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  createPoppy,
  createRequestHandler,
  createDescriptor
}
