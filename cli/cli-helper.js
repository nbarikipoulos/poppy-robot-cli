/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path')

const yargs = require('yargs')

const core = require('poppy-robot-core')

// Arguments descriptors
const ARGUMENT_DESC = require('./arguments')

/** Poppy instance.
 * Initialized once by init() call, and as it must be called first
 * */
let POPPY_INSTANCE

/** Accessor on Poppy Instance */
const getPoppyInstance = _ => {
  return POPPY_INSTANCE
}

// ////////////////////////////////
// Utility functions
// ////////////////////////////////

// init CLI args,
// initialize the POPPY_INSTANCE that will be used for any command and then
// avoid to instantiate it twice.
// In the case of the config command, this function does nothing.
// Indeed, it is dedicated to check connection settings and then, in the case
// of live discovering, intantiating a poppy does the job but returns an error.
// as the aim of this command is to display a friendly report about
// connection settings, skip it.
const init = async _ => {
  if (
    !yargs.argv._.includes('config')
  ) {
    const config = getUserConfiguration()
    POPPY_INSTANCE = await core.createPoppy(config)

    ARGUMENT_DESC.motor.details.choices = ['all'].concat(
      POPPY_INSTANCE.getAllMotorIds()
    )
  }
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

// Get configuration from .poppyrc file, if any and cli arguments
// get: 'connect' - connection settings object
//      'robot-desc' - robot descriptor locator
//      'all' -  get both settings as config object
const getUserConfiguration = (get = 'all') => {
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
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  getPoppyInstance,
  getArgDesc,
  addOptions,
  addPoppyConnectionOptions: _ => addOptions(
    'Poppy Connection Settings:',
    ['ip', 'httpPort', 'snapPort']
  ),
  getUserConfiguration: getUserConfiguration,
  init
}
