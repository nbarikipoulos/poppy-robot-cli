'use strict'

const fs = require('fs')
const path = require('path')

const yargs = require('yargs')

const { createRequestHandler: coreCreateRequesHandler } = require('poppy-robot-core')

const { prettifyError: prettify } = require('../lib/utils')

const { get: getArg } = require('./arguments')

// ////////////////////////////////
// Utility functions
// ////////////////////////////////

// init CLI args, aka list of motors when needed (-m option)
const init = async _ => {
  const skipGetPoppyStructure = !yargs.argv._.length ||
    ['config', 'reboot', 'shutdown', 'api', 'logs'].find(cmd => yargs.argv._.includes(cmd))

  if (!skipGetPoppyStructure) {
    try {
      const req = await coreCreateRequesHandler(configObject.getSettings())
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

const CONNECTION_OPTIONS = ['host', 'port']

const addConnectionOptionsGroup = (...options) => addOptions(
  options.length ? options : CONNECTION_OPTIONS,
  'Poppy Connection Settings:'
)

// ////////////////////////////////
// Utility functions for yargs builder
// ////////////////////////////////

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

// ////////////////////////////////
// User config utilities
// ////////////////////////////////

class Config {
  constructor () {
    // Config options from rc file and cli
    this._conf = undefined
  }

  getSettings (config = {}) { return { ...this._config, ...config } }

  get _config () {
    if (this._conf === undefined) {
      const poppyrc = loadRCFile()
      const cli = getConfigFromCLI()
      this._conf = { ...poppyrc, ...cli }
    }

    return this._conf
  }
}

const configObject = new Config()

const getConfigFromCLI = _ => {
  const result = {}

  for (const option of CONNECTION_OPTIONS) {
    const desc = getArg(option)
    const value = yargs.argv[option] ?? yargs.argv[desc.key]
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

// ////////////////////////////////
// poppyrc file utilities
// ////////////////////////////////

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
  for (const option of CONNECTION_OPTIONS) {
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

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  addOptions,
  addPositional,
  addConnectionOptionsGroup,
  configObject,
  saveRCFile,
  init
}
