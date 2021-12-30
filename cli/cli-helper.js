/*! Copyright (c) 2018-2021 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { readFileSync } = require('fs')
const path = require('path')

const yargs = require('yargs')

const { createPoppy } = require('poppy-robot-core')

const { prettifyError: prettify } = require('../lib/utils')

const { get: getArg } = require('./arguments')

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

      getArg('motor').opt.choices.push(...POPPY_INSTANCE.allMotorIds)
    } catch (error) {
      const msg = prettify(
        'warning',
        'Unable to get data about the Poppy structure: use the config command to check connection to Poppy'
      )

      return Promise.reject(msg)
    }
  }
}

const addOptions = (optionNames, groupName) => {
  for (const name of optionNames) {
    const desc = getArg(name)

    yargs.options(desc.key, desc.opt)
  }

  // Group options in group, if any.
  if (groupName) {
    yargs.group(optionNames, groupName)
  }
}

const addPositional = (key) => {
  const desc = getArg(key)
  yargs.positional('value', desc.opt)
}

const RC_FILE = '.poppyrc'

const loadRCFile = (file = RC_FILE) => {
  let option
  try {
    const buffer = readFileSync(
      path.resolve(process.cwd(), file),
      'utf8'
    )
    option = JSON.parse(buffer)
  } catch (error) { /* Do nothing */ }

  return option || {}
}

const getUserConfiguration = _ => {
  const config = { connect: {} }

  //
  // First, let read configuration from local .poppyrc file, if any
  //

  const poppyrc = loadRCFile()

  Object.assign(config, poppyrc)

  //
  // On a second hand, let's update the config object with settings
  // from the cli (connection settings only), if needed.
  //
  const longKeys = ['host', 'port'] // Same as connect object properties
  const connect = config.connect

  for (const longKey of longKeys) {
    const desc = getArg(longKey)
    const key = desc.key

    // Ensure that values have been passed by the cli
    // (yargs will set option to their default values if not provided).
    for (const opt of [`-${key}`, `--${desc.opt.alias}`]) {
      const idx = process.argv.indexOf(opt) + 1
      if (idx > 0) {
        const value = process.argv[idx]
        if (value === getArg(longKey).opt.default) {
          delete connect[longKey]
        } else {
          // prop 'ip' renamed to 'hostname' (core v10)
          connect[longKey === 'ip' ? 'host' : longKey] = value
        }
        break
      }
    }
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
  addOptions,
  addPositional,
  addPoppyConnectionOptions: _ => addOptions(
    ['host', 'port'],
    'Poppy Connection Settings:'
  ),
  getUserConfiguration,
  init
}
