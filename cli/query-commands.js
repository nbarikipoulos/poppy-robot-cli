/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const cliBuilderHelper = require('./cli-options')
const yargs = cliBuilderHelper.yargs

const Table = require('cli-table')

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = (poppy) => yargs.command(
  'query',
  'Query the state of Poppy motors.',
  (yargs) => {
    cliBuilderHelper.addOptions(
      'Query Options:',
      ['motor', 'register', 'invert']
    )

    cliBuilderHelper.addPoppyConfigurationOptions()

    yargs
      .example(
        '$0 query -r compliant',
        'Get the `compliant` register value of all motors'
      )
      .example(
        '$0 query -m m1 m6 -r present_position upper_limit',
        'Get the `present_position` and `upper_limit` register values of motors m1 and m6'
      )
  },
  (argv) => query(argv, poppy) // Main job
)

// ////////////////////////////////
// ////////////////////////////////
// Private
// ////////////////////////////////
// ////////////////////////////////

// ////////////////////////////////
// The query command itself
// ////////////////////////////////

const query = async (argv, poppy) => {
  const motorIds = argv.motor.includes('all')
    ? poppy.getAllMotorIds()
    : argv.motor

  const registers = argv.register

  //
  // Get data...
  //

  const result = await poppy.query(motorIds, registers)
    .catch(err => {
      console.log('Err: Unable to perform querying. Check connection settings:')
      console.log(`   Request URL: ${err.config.url}`)
      return undefined
    })

  //
  // ...And display them, if any
  //

  if (result) {
    const rows = argv.I ? motorIds : registers
    const cols = argv.I ? registers : motorIds

    const table = new Table({
      head: [].concat('', ...cols)
    })

    for (const row of rows) {
      table.push({
        [row]: cols.map(col => _format(
          argv.I ? result[row][col] : result[col][row])
        )
      })
    }

    // At last, let's display the result

    console.log(
      table.toString()
    )
  }
}

// ////////////////////////////////
// misc.
// ////////////////////////////////

const _format = value => (!isNaN(parseFloat(value)) ^ !Number.isInteger(value))
  ? value // String, Boolean, Integer
  : Number(value).toFixed(1) // Float: 1 significant digit is enough
