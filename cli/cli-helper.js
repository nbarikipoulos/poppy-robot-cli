/*! Copyright (c) 2018-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path')

const yargs = require('yargs')

const core = require('poppy-robot-core')

const prettify = require('../lib/utils').prettifyError

const ARGUMENT_DESC = require('./arguments')

/** Poppy instance.
 * Initialized once by init() call, and as it must be called first
 * */
let POPPY_INSTANCE

/** Accessor on Poppy Instance */
const getPoppyInstance = _ => {
  if (!POPPY_INSTANCE) {
    const connect = Object.assign({ // arf...
      ip: 'poppy.local',
      httpPort: 8080,
      snapPort: 6969
    }, getUserConfiguration('connect'))

    const msg = prettify(
      'error',
      'Unable to connect to Poppy: use the config command to check connection to Poppy',
      `hostname/ip: ${connect.ip}`,
      `http port: ${connect.httpPort}`,
      `snap port: ${connect.snapPort}`
    )
    throw new Error(msg)
  }

  return POPPY_INSTANCE
}

// ////////////////////////////////
// Utility functions
// ////////////////////////////////

// init CLI args,
// initialize the POPPY_INSTANCE that will be used for any command and then
// avoid to instantiate it twice.
// Note in the case of the config command, this function does nothing.
const init = async _ => {
  if (
    !yargs.argv._.includes('config')
  ) {
    try {
      const config = getUserConfiguration()
      POPPY_INSTANCE = await core.createPoppy(config)

      ARGUMENT_DESC.motor.details.choices = ['all'].concat(
        POPPY_INSTANCE.getAllMotorIds()
      )
    } catch (error) {
      delete ARGUMENT_DESC.motor.details.choices
      const msg = prettify(
        'warning',
        'Unable to get data about the Poppy structure: use the config command to check connection to Poppy'
      )

      return Promise.reject(msg)
    }
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
  //    locator: descriptor locator value,
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
      
      // Ensure that values have been passed by the cli
      // (yargs.argv properties will be set to default values if not provided).
      // Note yargs options has not been initialized yet.
      const hasKey = process.argv.includes(`-${key}`, 2)
      const hasAlias = process.argv.includes(`--${desc.details.alias}`, 2)

      if (hasKey || hasAlias) {
        const value = yargs.argv[ // 'raw cli'
          hasKey ? key : desc.details.alias
        ]
        if (value === getArgDesc(longKey).details.default) {
          delete connect[longKey]
        } else {
          connect[longKey] = value
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
      result = config.locator
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
  getUserConfiguration,
  init
}
