/*! Copyright (c) 2019-2021 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

/**
 * Simple wrapper of the poppy and request handler factories provided by the poppy-robot-core module
 * in order to automatically appends user's settings from both poppyrc file and CLI.
 * Overriding order of settings is: poppyrc <- cli flags <- factory arguments
 */

'use strict'

const {
  createPoppy: coreCreatePoppy,
  createRequestHandler: coreCreateRequesHandler,
  createDescriptor: coreCreateDescriptor
} = require('poppy-robot-core')

const { getUserConfiguration } = require('../cli/cli-helper')

const createPoppy = async (config = {}) => coreCreatePoppy({ connect: f(config.connect) })
const createRequestHandler = async (connect) => coreCreateRequesHandler(f(connect))
const createDescriptor = async (connect) => coreCreateDescriptor(f(connect))

const f = (connect) => ({ ...getUserConfiguration(), ...connect })

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
