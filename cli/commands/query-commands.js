/*! Copyright (c) 2018-2022 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const Table = require('cli-table')
const treeify = require('treeify')

const { createPoppy } = require('../../lib/ext-poppy-factory')
const { addOptions } = require('../cli-helper')
const { prettifyError: prettify } = require('../../lib/utils')

module.exports = [{
  cmd: 'query',
  desc: 'Query the state of Poppy motors.',
  builder: (yargs) => {
    addOptions(
      ['motor', 'register', 'invert', 'tree'],
      'Query Options:'
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
  handler: (argv) => query(argv) // Main job
}]

// ////////////////////////////////
// The query command itself
// ////////////////////////////////

const query = async (argv) => {
  const poppy = await createPoppy()

  const motorNames = argv.motor.includes('all')
    ? poppy.motorNames
    : argv.motor

  const registers = argv.register

  //
  // Get data...
  //

  const data = await poppy.query(motorNames, registers)
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
      ? _tree(d, poppy.descriptor)
      : _table(d, argv.I)

    console.log(result)
  }
}

// ////////////////////////////////
// Misc.
// ////////////////////////////////

// Display as tree
const _tree = (data, descriptor) => {
  const structure = getStructuredValues(descriptor, data)
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

// Structure data with robot structure aka aliases/motors
const getStructuredValues = (descriptor, data) => {
  const motorIds = Object.keys(data)
  const registers = Object.keys(data[motorIds[0]])

  return descriptor.aliases
    .map(alias => ({
      name: alias.name,
      motors: alias.motors
        .filter(motor => data[motor])
        .reduce((acc, motor) => {
          // 1 register queried => compact motor name and value on a single line
          acc[motor] = registers.length === 1
            ? Object.values(data[motor])[0]
            : data[motor] // should be copied...
          return acc
        }, {})
    }))
}

// Display as table
const _table = (data, invert = false) => {
  const motorIds = Object.keys(data)
  const registers = Object.keys(data[motorIds[0]])

  const rows = invert ? motorIds : registers
  const cols = invert ? registers : motorIds

  const value = (invert, col, row) => invert ? data[row][col] : data[col][row]

  const table = new Table({ head: ['', ...cols] })

  for (const row of rows) {
    table.push({
      [row]: cols.map(col => value(invert, col, row))
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
    case 'undefined':
      fn = _ => '---'
      break
    default:
      fn = (value) => (!isNaN(parseFloat(value)) ^ !Number.isInteger(value))
        ? value // String, Boolean, Integer
        : Number(value).toFixed(1) // Float: 1 significant digit is enough
  }

  return fn(value)
}
