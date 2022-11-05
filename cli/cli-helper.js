'use strict'

const fs = require('fs')
const path = require('path')

const { createRequestHandler: coreCreateRequesHandler, DEFAULT_SETTINGS } = require('poppy-robot-core')

const { prettifyError: prettify } = require('../lib/utils')

const { get: getArg } = require('./arguments')

const CONNECTION_OPTIONS = ['host', 'port']

// ////////////////////////////////
// Utility functions
// ////////////////////////////////

// init CLI args, aka list of motors when needed (-m option)
const init = async _ => {
  const argv = process.argv

  const skipGetPoppyStructure = argv.length <= 2 ||
    [
      'config',
      'reboot',
      'shutdown',
      'api',
      'logs'
    ].includes(argv[2])

  if (!skipGetPoppyStructure) {
    try {
      const config = configObject.getSettings(getConfigFromRawCli(argv))

      const req = await coreCreateRequesHandler(config)
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

// ////////////////////////////////
// Helper for yargs builder
// ////////////////////////////////

class YargsHelper {
  constructor (yargs) {
    this._yargs = yargs
  }

  get yargs () { return this._yargs }

  addOptions (optionNames, groupName) {
    for (const name of optionNames) {
      const desc = getArg(name)

      this._yargs.options(desc.key, desc.opt)
    }

    // Group options in group, if any.
    if (groupName) {
      this._yargs.group(optionNames, groupName)
    }

    return this
  }

  addPositional (key, cliKey = 'value') {
    const desc = getArg(key)
    this._yargs.positional(cliKey, desc.opt)
    return this
  }

  addConnectionOptionsGroup (...options) {
    return this.addOptions(
      options.length ? options : CONNECTION_OPTIONS,
      'Poppy Connection Settings:'
    )
  }
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

  return config ?? {}
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
// User config utilities
// ////////////////////////////////

class Config {
  constructor () {
    // Config options from rc file and cli
    this._poppyrc = loadRCFile()
    this._conf = { ...this._poppyrc }
  }

  getSettings (config = {}) { return { ...this._conf, ...config } }

  add (argv, type = 'raw') {
    let config = {}
    switch (type) {
      case 'yargs':
        config = getConfigFromYargs(argv)
        break
      case 'raw':
        config = getConfigFromRawCli(argv)
        break
      default:
        /* Do nothing */
    }
    this._conf = this.getSettings(config)
  }

  toString (config, level = 'info') {
    const conf = this.getSettings(config)
    const host = conf.host ?? DEFAULT_SETTINGS.host
    const port = conf.port ?? DEFAULT_SETTINGS.port

    return prettify(
      level,
      `Poppy: ${host}:${port}`
    )
  }
}

const getConfigFromRawCli = (argv) => {
  const result = {}

  for (const option of CONNECTION_OPTIONS) {
    const desc = getArg(option)
    const value = isProvidedViaCLI(desc)

    if (value !== undefined) {
      result[option] = value
    }
  }

  return result
}

const getConfigFromYargs = (argv) => {
  const result = {}

  for (const option of CONNECTION_OPTIONS) {
    const desc = getArg(option)
    const value = argv[option] ?? argv[desc.key]
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
  const argv = process.argv

  const flags = [`-${desc.key}`, `--${desc.opt.alias}`]
  let value
  for (const flag of flags) {
    const idx = argv.indexOf(flag)
    if (idx !== -1) {
      value = argv[idx + 1]
      break
    }
  }
  return value
}

const configObject = new Config()

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  createYargsHelper: (yargs) => new YargsHelper(yargs),
  configObject,
  saveRCFile,
  init,
  getConfigFromCLI: getConfigFromYargs
}
