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

  for (const opt of optionKeys) {
    const o = ARGUMENT_DESC[opt]
    const key = o.key

    keys.push(key)
    yargs.options(key, o.details)

    if (
      mandatoryOptionKeys.includes(opt) // ...
    ) {
      yargs.demand(key, 'This option is mandatory.')
    }
  }

  // Group all these options in one group.
  if (groupName) {
    yargs.group(keys, groupName)
  }
}

const getPoppyConfiguration = (argv) => {
  const config = { connect: {} }

  const ckeys = { // FIXME use _OPTIONS...
    ip: { flags: ['i', 'ip'], default: 'poppy.local' },
    httpPort: { flags: ['p', 'httpPort', 'http-port'], default: 8080 },
    snapPort: { flags: ['P', 'snapPort', 'snap-port'], default: 6969 }
  }

  const tr = (tgt, src, fromCli = true) => { // arf...
    for (const k in ckeys) {
      const flags = ckeys[k].flags
      const v = flags.find(elt => undefined != src[elt]) // FIXME !
      if (v) {
        if (fromCli) {
          const isDefault = src[v] === ckeys[k].default
          if (isDefault) {
            const isSetFromCLI = process.argv // ensure it comes from cli, not default from yargs...
              .slice(2) // not relevant
              .map(elt => elt.replace(/^[-]+/, '')) // remove '-', '--'
              .some(elt => flags.includes(elt)) // check if found

            if (isSetFromCLI) {
              delete tgt[k] // Remove it...
            }
          } else {
            tgt[k] = src[v] // ...Affect it
          }
        } else { // we take everyting from the .poppyrc file
          tgt[k] = src[v]
        }
      }
    }
  }

  //
  // First, let read configuration from local .poppyrc file, if any
  //
  try {
    const configFile = path.resolve(process.cwd(), '.poppyrc')
    const poppyrc = JSON.parse(fs.readFileSync(configFile, 'utf8'))

    // Connexion settings
    tr(config.connect, poppyrc.connect || {}, false)
    // Robot descriptor
    if (poppyrc.descriptor) {
      config.descriptor = poppyrc.descriptor
    }
  } catch (error) { /* Do nothing */ }

  // On a second hand, let's obtain settings from the cli.
  // Note Poppy configuration is called before initializing the yargs context
  // in CLI mode...

  tr(config.connect, argv)

  return config
}

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
  get: (longKeyId) => ARGUMENT_DESC[longKeyId].key,
  addOptions,
  addPoppyConfigurationOptions: _ => addOptions(
    'Poppy Setting Options:',
    ['ip', 'http_port', 'snap_port']
  ),
  getPoppyConfiguration
}
