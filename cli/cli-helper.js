/*! Copyright (c) 2018-2021 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path')

const yargs = require('yargs')

const { createPoppy } = require('poppy-robot-core')

const { prettifyError: prettify } = require('../lib/utils')

const ARGUMENT_DESC = require('./arguments')

const { DEFAULT_CONNECTION_SETTINGS } = require('poppy-robot-core')

/** Poppy instance.
 * Initialized once by init() call, and as it must be called first
 * */
let POPPY_INSTANCE

/** Accessor on Poppy Instance */
const getPoppyInstance = _ => {
  if (!POPPY_INSTANCE) {
    const connect = {
      ...DEFAULT_CONNECTION_SETTINGS,
      ...getUserConfiguration()
    }

    const msg = prettify(
      'error',
      'Unable to connect to Poppy: use the config command to check connection to Poppy',
      `hostname/ip: ${connect.ip}`,
      `port: ${connect.port}`
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
  const skipGetPoppyStructure = !yargs.argv._.length ||
    ['config', 'reboot', 'shutdown', 'api', 'logs'].find(cmd => yargs.argv._.includes(cmd))

  if (!skipGetPoppyStructure) {
    try {
      const connect = getUserConfiguration()
      POPPY_INSTANCE = await createPoppy({ connect })

      ARGUMENT_DESC.motor.details.choices = ['all'].concat(
        POPPY_INSTANCE.allMotorIds
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

const getUserConfiguration = _ => {
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
  const longKeys = ['ip', 'port'] // Same as connect object properties
  const connect = config.connect

  for (const longKey of longKeys) {
    const desc = getArgDesc(longKey)
    const key = desc.key

    // Ensure that values have been passed by the cli
    // (yargs will set option to their default values if not provided).
    for (const opt of [`-${key}`, `--${desc.details.alias}`]) {
      const idx = process.argv.indexOf(opt) + 1
      if (idx > 0) {
        const value = process.argv[idx]
        if (value === getArgDesc(longKey).details.default) {
          delete connect[longKey]
        } else {
          // prop 'ip' renamed to 'hostname' (core v10)
          connect[longKey === 'ip' ? 'hostname' : longKey] = value
        }
        break
      }
    }
  }

  // prop 'ip' renamed to 'hostname' (core v10)
  if (connect.ip) {
    connect.hostname = connect.hostname || connect.ip
    delete connect.ip
  }

  // At last, clean-up the config object
  // if no connection properties have been set
  if (Object.keys(connect).length === 0) {
    delete config.connect
  }

  return config.connect || {}
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
    ['ip', 'port']
  ),
  getUserConfiguration,
  init
}
