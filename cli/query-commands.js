/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const Table = require('cli-table')

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = (yargs, helper) => yargs.command(
  'query',
  'Query the state of Poppy motors.',
  (yargs) => {
    const optionHelper = helper.optionHelper

    optionHelper.addOptions(
      yargs,
      'Query Options:',
      ['motor', 'register', 'invert']
    )
    optionHelper.addPoppyConfigurationOptions(yargs)

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
  (argv) => query(argv, helper.poppy) // Main job
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
  const motors = argv.motor.includes('all')
    ? poppy.getAllMotorIds()
    : argv.motor

  const registers = argv.register

  //
  // Get data...
  //

  const result = await _query(poppy, motors, registers)

  //
  // ...And display them, if any
  //
  if (result) {
    const display = argv.I
      ? {
        rows: motors,
        cols: registers,
        cb: (row) => {
          const o = {}
          o[row] = Object.values(
            result.find(obj => row === obj.motor)
          )
            .slice(1) // motor attribute
            .map(v => _format(v)) // other attributes are register values

          return o
        }
      }
      : {
        rows: registers,
        cols: motors,
        cb: (row) => {
          const o = {}
          o[row] = result.map(res => _format(res[row]))
          return o
        }
      }

    const table = new Table({
      head: [].concat('', ...display.cols)
    })

    for (const row of display.rows) {
      table.push(
        display.cb.call(null, row)
      )
    }

    // At last, let's display the result

    console.log(
      table.toString()
    )
  }
}

const _query = async (poppy, motors, registers) => {
  let res = []

  await Promise.all(motors.map(async motor => {
    // for(let motor of motors) {
    const data = (await Promise.all(
      registers.map(async register =>
        poppy[motor].get(register)
      )
    ))
      .reduce((acc, obj) => Object.assign(acc, obj),
        { motor }
      )

    res.push(data)
  }))
    .catch(err => {
      console.log('Err: Unable to perform querying. Check connection settings:')
      console.log(`   Request URL: ${err.config.url}`)
      res = null
    })

  return res
}

// ////////////////////////////////
// misc.
// ////////////////////////////////

const _format = value => (!isNaN(parseFloat(value)) ^ !Number.isInteger(value))
  ? value // String, Boolean, Integer
  : Number(value).toFixed(1) // Float: 1 significant digit is enough
