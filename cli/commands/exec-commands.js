/*! Copyright (c) 2018-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const yargs = require('yargs')

const Script = require('poppy-robot-core').Script

const cliBuilderHelper = require('../cli-helper')

const EXEC_CMD_GROUP_LABEL = 'Command Options:'

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = _ => {
  for (const command of COMMANDS) {
    yargs.command(
      command.cmd,
      command.desc,
      command.builder,
      command.handler
    )
  }
}

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

  // Get already instantiaed poppy object a Poppy object
  const poppy = cliBuilderHelper.getPoppyInstance()
  //
  // create a poppy script...
  //

  const script = new Script()
    .select(...motors)

  script[type](...values)

  //
  // ... and execute it
  //
  await poppy.exec(script)
}

// ////////////////////////////////
// Command "descriptors"
// ////////////////////////////////

const COMMANDS = [{
  cmd: 'compliant',
  desc: 'Set state of selected motor(s) to compliant (i.e. handly drivable).',
  builder: (yargs) => {
    cliBuilderHelper.addOptions(
      EXEC_CMD_GROUP_LABEL,
      ['motor']
    )

    yargs
      .strict()
      .example(
        '$0 exec compliant',
        'Set state of all motors to compliant.'
      )
      .example(
        '$0 exec compliant -m m4 m6',
        'Only set state of motors m4 and m6 to compliant.'
      )
  },
  handler: (argv) => exec('compliant', argv.motor, { compliant: true })
}, {
  cmd: 'stiff',
  desc: 'Set state of selected motor(s) to stiff (i.e. programmatically drivable).',
  builder: (yargs) => {
    cliBuilderHelper.addOptions(
      EXEC_CMD_GROUP_LABEL,
      ['motor']
    )

    yargs
      .strict()
      .example(
        '$0 exec stiff',
        'Set state of all motors to stiff.'
      )
      .example(
        '$0 exec compliant -m m4 m6',
        'Only set state of motors m4 and m6 to stiff.'
      )
  },
  handler: (argv) => exec('compliant', argv.motor, { compliant: false })
}, {
  cmd: 'speed <value>',
  desc: 'Set the rotation speed of the selected motor(s).\n' +
    'Value must be in the [0, 1023] range',
  builder: (yargs) => {
    cliBuilderHelper.addOptions(
      EXEC_CMD_GROUP_LABEL,
      ['motor']
    )

    // Add the positional argument of this command
    const desc = cliBuilderHelper.getArgDesc('speed')
    yargs.positional('value', desc)

    yargs
      .example(
        '$0 exec speed 100',
        'Set the rotation speed of all motors to 100 (slower).'
      )
      .example(
        '$0 exec speed 500 -m m1 m2',
        'Set the rotation speed of the motors m1 and m2 to 500 (quicker).'
      )
  },
  handler: (argv) => exec('speed', argv.motor, { speed: argv.value })
}, {
  cmd: 'rotate <value>',
  desc: 'Rotate the target motor(s) by x degrees',
  builder: (yargs) => {
    cliBuilderHelper.addOptions(
      EXEC_CMD_GROUP_LABEL,
      ['motor', 'wait']
    )

    // Add the positional argument of this command
    const desc = cliBuilderHelper.getArgDesc('rotate')
    yargs.positional('value', desc)

    yargs
      .example(
        '$0 exec rotate -30 -m m1 m2 -w',
        'Rotate the motors m1 and m2 by -30 degrees and wait until each motors will reach its new position.'
      )
  },
  handler: (argv) => exec('rotate', argv.motor, { angle: argv.value, wait: argv.wait })
}, {
  cmd: 'position <value>',
  desc: 'Set the target position of the selected motor(s)',
  builder: (yargs) => {
    cliBuilderHelper.addOptions(
      EXEC_CMD_GROUP_LABEL,
      ['motor', 'wait']
    )

    // Add the positional argument of this command
    const desc = cliBuilderHelper.getArgDesc('position')
    yargs.positional('value', desc)

    yargs
      .example(
        '$0 exec position 0 -m m1 m2 -w',
        'Move the motors m1 and m2 to the 0 degree position and wait until each motors will reach its new position.'
      )
  },
  handler: (argv) => exec('position', argv.motor, { position: argv.value, wait: argv.wait })
}, {
  cmd: 'led [value]',
  desc: 'Set the led color of the selected motor(s)',
  builder: (yargs) => {
    cliBuilderHelper.addOptions(
      EXEC_CMD_GROUP_LABEL,
      ['motor']
    )

    // Add the positional argument of this command
    const desc = cliBuilderHelper.getArgDesc('led')
    yargs.positional('value', desc)

    yargs
      .example(
        '$0 exec led',
        'Turn off the led of all motors.'
      )
      .example(
        '$0 exec led green -m m3',
        'Set the led color of motor \'m3\' to \'green\'.'
      )
  },
  handler: (argv) => exec('led', argv.motor, { led: argv.value })
}]
