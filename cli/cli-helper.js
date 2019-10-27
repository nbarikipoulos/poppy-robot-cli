/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path')

const yargs = require('yargs')

// Arguments descriptors
const ARGUMENT_DESC = require('./arguments')

// ////////////////////////////////
// Utility functions
// ////////////////////////////////

const addOptions = (
  groupName,
  optionKeys,
  ...mandatoryOptionKeys
) => {
  const keys = []

  for (const longKey of optionKeys) {
    const desc = getArgDesc(longKey)
    const key = desc.key

    keys.push(key)
    yargs.options(key, desc.details)

    if (
      mandatoryOptionKeys.includes(longKey) // ...
    ) {
      yargs.demand(key, 'This option is mandatory.')
    }
  }

  // Group all these options in one group.
  if (groupName) {
    yargs.group(keys, groupName)
  }
}

const getPoppyConfiguration = () => {
  //
  // config object:{
  //    descriptor: descriptor locator value,
  //    connect: {
  //      ip: hostname/ip value,
  //      httpPort: pypot http server port,
  //      snapPort: snap server port
  //    }
  // }
  //
  const config = { connect: {} }
  //
  // First, let read configuration from local .poppyrc file, if any
  //
  try {
    const configFile = path.resolve(process.cwd(), '.poppyrc')
    const poppyrc = JSON.parse(fs.readFileSync(configFile, 'utf8'))
    Object.assign(
      config,
      poppyrc
    )
  } catch (error) { /* Do nothing */ }
  //
  // On a second hand, let's obtain settings from the cli (connection settings only)
  //
  const longKeys = ['ip', 'httpPort', 'snapPort'] // Same as connect object properties
  const connect = config.connect

  for (const longKey of longKeys) {
    const desc = getArgDesc(longKey)
    const key = desc.key
    // Ensure that values have been filled in cli
    // yargs.argv properties are set to default values if not provided
    if (
      process.argv.includes(`-${key}`, 2) ||
      process.argv.includes(`--${desc.details.alias}`, 2)
    ) {
      connect[longKey] = yargs.argv[key]
    }
  }
  //
  // At last, let's clean default value of the result object up
  //
  longKeys.forEach(longKey => {
    if (connect[longKey] === getArgDesc(longKey).details.default) {
      delete connect[longKey]
    }
  })
  if (Object.keys(connect).length === 0) {
    delete config.connect
  }

  return config
}

const getArgDesc = (longKeyId) => ARGUMENT_DESC[longKeyId]

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  yargs, // re-export
  init: (poppy) => { // arf...
    ARGUMENT_DESC.motor.details.choices.push(
      ...poppy.getAllMotorIds()
    )
  },
  getArgDesc,
  addOptions,
  addPoppyConfigurationOptions: _ => addOptions(
    'Poppy Setting Options:',
    ['ip', 'httpPort', 'snapPort']
  ),
  getPoppyConfiguration
}
