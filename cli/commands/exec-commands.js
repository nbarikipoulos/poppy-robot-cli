/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const yargs = require('yargs')

const Script = require('poppy-robot-core').Script

const cliBuilderHelper = require('../cli-helper')
const createPoppyInstance = require('../../lib/ext-poppy-factory')

const EXEC_CMD_GROUP_LABEL = 'Command Options:'

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = _ => yargs.command(
  'exec',
  'Execute command on Poppy. Type $0 exec <command> -h for help on each command.',
  (yargs) => {
    for (const command of COMMANDS) {
      yargs.command(
        command.name,
        command.desc,
        command.builder,
        command.handler
      )
    }

    // Once again... Done in order to group these options
    // in a nice way for each exec command.
    cliBuilderHelper.addPoppyConnectionOptions()

    yargs.demandCommand(1, 'Use at least one command')
  }
)

// ////////////////////////////////
// ////////////////////////////////
// Private
// ////////////////////////////////
// ////////////////////////////////

// ...

// ////////////////////////////////
// Execute simple command
// ////////////////////////////////

async function exec (type, motors, options) {
  // FIXME ugly hack for compliant state argument
  const values = Object.values(options).map(val => {
    if (type === 'compliant') { // arf...
      if (val === 'on') return true
      if (val === 'off') return false
    }
    return val
  })

  // Instantiate a Poppy object
  const poppy = createPoppyInstance()

  //
  // create a poppy script...
  //

  const script = new Script()
    .select(...motors)

  script[type](...values)

  //
  // ... and execute it
  //
  poppy.exec(script)
}

// ////////////////////////////////
// Command "descriptors"
// ////////////////////////////////

const COMMANDS = [{
  name: 'compliant',
  desc: 'Set the compliant state of the selected motor(s)',
  builder: (yargs) => {
    cliBuilderHelper.addOptions(
      EXEC_CMD_GROUP_LABEL,
      ['motor', 'compliant']
    )

    yargs
      .strict()
      .example(
        '$0 exec compliant',
        'Switch all motors compliant state to \'false\' i.e. motors are addressable.'
      )
      .example(
        '$0 exec compliant -v off',
        'Switch all motors compliant state to \'false\' i.e. motors are addressable.'
      )
      .example(
        '$0 exec compliant -v on',
        'Switch all motors compliant state to \'true\' i.e. motors are not addressable.'
      )
  },
  handler: (argv) => exec('compliant', argv.motor, { compliant: argv.value })
}, {
  name: 'speed',
  desc: 'Set the rotation speed of the selected motor(s).\n' +
    'Value must be in the [0, 1023] range',
  builder: (yargs) => {
    cliBuilderHelper.addOptions(
      EXEC_CMD_GROUP_LABEL,
      ['motor', 'speed'],
      'speed'
    )

    yargs
      .example(
        '$0 exec speed -v 100',
        'Set the rotation speed of all motors to 100 (slower).'
      )
      .example(
        '$0 exec speed -m m1 m2 -v 500 (quicker)',
        'Set the rotation speed of the motors m1 and m2 to 500 (quicker).'
      )
  },
  handler: (argv) => exec('speed', argv.motor, { speed: argv.value })
}, {
  name: 'rotate',
  desc: 'Rotate the target motor(s) by x degrees',
  builder: (yargs) => {
    cliBuilderHelper.addOptions(
      EXEC_CMD_GROUP_LABEL,
      ['motor', 'rotate', 'wait'],
      'rotate'
    )

    yargs
      .example(
        '$0 exec rotate -m m1 m2 -v -30 -w',
        'Rotate the motors m1 and m2 by -30 degrees and wait until each motors will reach its new position.'
      )
  },
  handler: (argv) => exec('rotate', argv.motor, { angle: argv.value, wait: argv.wait })
}, {
  name: 'position',
  desc: 'Set the target position of the selected motor(s)',
  builder: (yargs) => {
    cliBuilderHelper.addOptions(
      EXEC_CMD_GROUP_LABEL,
      ['motor', 'position', 'wait'],
      'position'
    )

    yargs
      .example(
        '$0 exec position -m m1 m2 -v 0 -w',
        'Move the motors m1 and m2 to the 0 degree position and wait until each motors will reach its new position.'
      )
  },
  handler: (argv) => exec('position', argv.motor, { position: argv.value, wait: argv.wait })
}, {
  name: 'led',
  desc: 'Set the led of the selected motor(s)',
  builder: (yargs) => {
    cliBuilderHelper.addOptions(
      EXEC_CMD_GROUP_LABEL,
      ['motor', 'led']
    )

    yargs
      .example(
        '$0 exec led',
        'Turn off the led of all motors.'
      )
      .example(
        '$0 exec -m m3 led -v green',
        'Set the led color of motor \'m3\' to \'green\'.'
      )
  },
  handler: (argv) => exec('led', argv.motor, { led: argv.value })
}]
