/*! Copyright (c) 2018-2022 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path')

const yargs = require('yargs')

const { createRequestHandler: coreCreateRequesHandler } = require('poppy-robot-core')

const { prettifyError: prettify } = require('../lib/utils')

const { get: getArg } = require('./arguments')

// Connection options
const connectOptions = ['host', 'port']

let conf

// ////////////////////////////////
// Utility functions
// ////////////////////////////////

// init CLI args,
const init = async _ => {
  const skipGetPoppyStructure = !yargs.argv._.length ||
    ['config', 'reboot', 'shutdown', 'api', 'logs'].find(cmd => yargs.argv._.includes(cmd))

  if (!skipGetPoppyStructure) {
    try {
      const req = await coreCreateRequesHandler(getUserConfiguration())
      const motors = (await req.perform('/motors/list.json')).data.motors

      getArg('motor').opt.choices.push(...motors)
    } catch (error) {
      const msg = prettify(
        'warning',
        'Unable to get data about the Poppy structure: use the config command to check the connection settings'
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
  let config
  try {
    const buffer = fs.readFileSync(
      path.resolve(process.cwd(), file),
      'utf8'
    )
    config = JSON.parse(buffer)
  } catch (error) { /* Do nothing */ }

  return config || {}
}

const saveRCFile = (config, file = RC_FILE) => {
  // Do not save default values
  const toSave = {}
  for (const option of connectOptions) {
    const desc = getArg(option)
    const value = config[option]
    const defaultValue = desc?.opt?.default
    // No default defined or values are different
    if (value !== undefined && value !== defaultValue) {
      toSave[option] = value
    }
  }

  fs.writeFileSync(
    path.resolve(process.cwd(), file),
    JSON.stringify(toSave)
  )
}

const getConf = _ => {
  if (conf === undefined) {
    const poppyrc = loadRCFile()
    const cli = getConfigFromCLI()
    conf = { ...poppyrc, ...cli }
  }

  return conf
}

// Get Connection settings from poppyrc/CLI
const getUserConfiguration = (config = {}) => {
  return { ...getConf(), ...config }
}

const getConfigFromCLI = _ => {
  const result = {}

  for (const option of connectOptions) {
    const desc = getArg(option)
    const value = yargs.argv[option]
    const defaultValue = desc.opt.default

    // Do not keep default settings if not explicitly filled by user
    if (
      value !== undefined &&
      (value !== defaultValue || isProvidedViaCLI(desc))
    ) {
      result[option] = value
    }
  }

  return result
}

const isProvidedViaCLI = (desc) => {
  const found = (value) => process.argv.indexOf(value) !== -1
  return found(`-${desc.key}`) || found(`--${desc.opt.alias}`)
}

const addPoppyConnectionOptions = _ => addOptions(
  connectOptions,
  'Poppy Connection Settings:'
)

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  addOptions,
  addPositional,
  addPoppyConnectionOptions,
  getUserConfiguration,
  saveRCFile,
  init
}
