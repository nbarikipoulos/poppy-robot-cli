/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path')

const yargs = require('yargs')

const core = require('poppy-robot-core')

// Arguments descriptors
const ARGUMENT_DESC = require('./arguments')

// ////////////////////////////////
// Utility functions (Poppy configuration)
// ////////////////////////////////

// Get configuration from .poppyrc file, if any and cli arguments
// get: 'connect' - connection settings object
//      'robot-desc' - robot descriptor locator
//      'all' -  get both settings as config object
// FIXME call and performed many times => Modify to singleton
const getPoppyConfiguration = (get = 'all') => {
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
  // On a second hand, let's update the config object with settings
  // from the cli (connection settings only), if needed.
  //
  if (get === 'all' || get === 'connect') {
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
        const value = yargs.argv[key]
        if (value === getArgDesc(longKey).details.default) {
          delete connect[longKey]
        } else {
          connect[longKey] = yargs.argv[key]
        }
      }
    }
    // At last, clean-up the config object
    // if no connection properties have been set
    if (Object.keys(connect).length === 0) {
      delete config.connect
    }
  }

  // Let's extract result object
  let result

  switch (get) {
    case 'connect':
      result = config.connect || {}
      break
    case 'descriptor':
      result = config.descriptor
      break
    case 'all':
    case 'default':
      result = config
      break
  }

  return result
}

// ////////////////////////////////
// Utility functions (cli options)
// ////////////////////////////////

// Init "dynamical" descriptors
const initOptionDescriptors = _ => {
  // Motors lists are provided:
  // Using the default value 'desc:://poppy-ergo-jr
  // Or, if any, through the descriptor properties of .poppyrc file
  const descriptor = getPoppyConfiguration('robot-desc')

  // Then, instantiate a dummy poppy object using this descriptor:
  const poppy = core.createPoppy({ descriptor })

  // At last, update the descriptor for motor option
  ARGUMENT_DESC.motor.details.choices = ['all'].concat(
    poppy.getAllMotorIds()
  )
}

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

const getArgDesc = (longKeyId) => ARGUMENT_DESC[longKeyId]

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  initOptionDescriptors,
  getArgDesc,
  addOptions,
  addPoppyConnectionOptions: _ => addOptions(
    'Poppy Setting Options:',
    ['ip', 'httpPort', 'snapPort']
  ),
  getPoppyConfiguration
}
