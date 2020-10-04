/*! Copyright (c) 2018-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const yargs = require('yargs')

const Table = require('cli-table')
const treeify = require('treeify')

const { addOptions, getPoppyInstance } = require('../cli-helper')
const { prettifyError: prettify } = require('../../lib/utils')

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = _ => yargs.command(
  'query',
  'Query the state of Poppy motors.',
  (yargs) => {
    addOptions(
      'Query Options:',
      ['motor', 'register', 'invert', 'tree']
    )

    yargs
      .example(
        '$0 query -r compliant',
        'Get the `compliant` register value of all motors'
      )
      .example(
        '$0 query -r compliant -t',
        'Get the `compliant` register value of all motors and display result as tree.'
      )
      .example(
        '$0 query -m m1 m6 -r present_position upper_limit',
        'Get the `present_position` and `upper_limit` register values of motors m1 and m6'
      )
  },
  (argv) => query(argv) // Main job
)

// ////////////////////////////////
// ////////////////////////////////
// Private
// ////////////////////////////////
// ////////////////////////////////

// ////////////////////////////////
// The query command itself
// ////////////////////////////////

const query = async (argv) => {
  // Poppy instance
  const poppy = getPoppyInstance()

  const motorIds = argv.motor.includes('all')
    ? poppy.getAllMotorIds()
    : argv.motor

  const registers = argv.register

  //
  // Get data...
  //

  const data = await poppy.query(motorIds, registers)
    .catch(error => {
      throw new Error(prettify(
        'error',
        'Unable to perform querying. Check connection settings',
        `Request URL: ${error.config.url}`
      ))
    })

  //
  // ...and display them, if any
  //

  if (data) {
    const d = _format(data)
    const result = argv.t
      ? _tree(d, poppy.getDescriptor())
      : _table(d, argv.I)

    console.log(result)
  }
}

// ////////////////////////////////
// Misc.
// ////////////////////////////////

// Display as tree
const _tree = (data, descriptor) => {
  const motorIds = Object.keys(data)
  const registers = Object.keys(data[motorIds[0]])

  const structure = descriptor.aliases
    .map(alias => ({
      name: alias.name,
      motors: alias.motors
        .filter(m => data[m])
        .reduce((acc, m) => {
          acc[m] = registers.length === 1
            ? Object.values(data[m])[0]
            : data[m] // should be copied...
          return acc
        }, {})
    }))
    .filter(alias => Object.keys(alias.motors).length !== 0)
    .reduce((acc, alias) => {
      acc[alias.name] = alias.motors
      return acc
    }, {})

  let tree = 'Poppy\n'

  treeify.asLines(
    structure,
    true,
    (line) => { tree += ` ${line}\n` }
  )

  return tree
}

// Display as table
const _table = (data, invert = false) => {
  const motorIds = Object.keys(data)
  const registers = Object.keys(data[motorIds[0]])

  const rows = invert ? motorIds : registers
  const cols = invert ? registers : motorIds

  const table = new Table({
    head: [].concat('', ...cols)
  })

  for (const row of rows) {
    table.push({
      [row]: cols.map(col => invert ? data[row][col] : data[col][row])
    })
  }

  return table.toString()
}

const _format = (value) => {
  const type = typeof value
  let fn

  switch (type) {
    case 'object':
      fn = (object) => {
        Object.entries(object)
          .forEach(([k, v]) => { object[k] = _format(v) })
        return object
      }
      break
    default:
      fn = (value) => (!isNaN(parseFloat(value)) ^ !Number.isInteger(value))
        ? value // String, Boolean, Integer
        : Number(value).toFixed(1) // Float: 1 significant digit is enough
  }

  return fn(value)
}
