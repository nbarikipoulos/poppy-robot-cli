/*! Copyright (c) 2018-2022 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { Script } = require('poppy-robot-core')

const { addOptions, addPositional } = require('../cli-helper')
const { createPoppy } = require('../../lib/ext-poppy-factory')

const EXEC_CMD_GROUP_LABEL = 'Command Options:'

module.exports = [{
  cmd: 'compliant',
  desc: 'Set state of selected motor(s) to compliant (i.e. handly drivable).',
  builder: (yargs) => {
    addOptions(
      ['motor'],
      EXEC_CMD_GROUP_LABEL
    )

    yargs
      .strict()
      .example(
        '$0 compliant',
        'Set state of all motors to compliant.'
      )
      .example(
        '$0 compliant -m m4 m6',
        'Only set state of motors m4 and m6 to compliant.'
      )
  },
  handler: (argv) => exec('compliant', argv.motor)
}, {
  cmd: 'stiff',
  desc: 'Set state of selected motor(s) to stiff (i.e. programmatically drivable).',
  builder: (yargs) => {
    addOptions(
      ['motor'],
      EXEC_CMD_GROUP_LABEL
    )

    yargs
      .strict()
      .example(
        '$0 stiff',
        'Set state of all motors to stiff.'
      )
      .example(
        '$0 compliant -m m4 m6',
        'Only set state of motors m4 and m6 to stiff.'
      )
  },
  handler: (argv) => exec('stiff', argv.motor)
}, {
  cmd: 'speed <value>',
  desc: 'Set the rotation speed of the selected motor(s).\n' +
    'Value must be in the [0, 1023] range',
  builder: (yargs) => {
    addOptions(
      ['motor'],
      EXEC_CMD_GROUP_LABEL
    )

    // Add the positional argument of this command
    addPositional('speed')

    yargs
      .example(
        '$0 speed 100',
        'Set the rotation speed of all motors to 100 (slower).'
      )
      .example(
        '$0 speed 500 -m m1 m2',
        'Set the rotation speed of the motors m1 and m2 to 500 (quicker).'
      )
  },
  handler: (argv) => exec('speed', argv.motor, { speed: argv.value })
}, {
  cmd: 'rotate <value>',
  desc: 'Rotate the target motor(s) by x degrees',
  builder: (yargs) => {
    addOptions(
      ['motor', 'wait'],
      EXEC_CMD_GROUP_LABEL
    )

    // Add the positional argument of this command
    addPositional('rotate')

    yargs
      .example(
        '$0 rotate -30 -m m1 m2 -w',
        'Rotate the motors m1 and m2 by -30 degrees and wait until each motors will reach its new position.'
      )
  },
  handler: (argv) => exec('rotate', argv.motor, { angle: argv.value, wait: argv.wait })
}, {
  cmd: 'position <value>',
  desc: 'Set the target position of the selected motor(s)',
  builder: (yargs) => {
    addOptions(
      ['motor', 'wait'],
      EXEC_CMD_GROUP_LABEL
    )

    // Add the positional argument of this command
    addPositional('position')

    yargs
      .example(
        '$0 position 0 -m m1 m2 -w',
        'Move the motors m1 and m2 to the 0 degree position and wait until each motors will reach its new position.'
      )
  },
  handler: (argv) => exec('position', argv.motor, { position: argv.value, wait: argv.wait })
}, {
  cmd: 'led [value]',
  desc: 'Set the led color of the selected motor(s)',
  builder: (yargs) => {
    addOptions(
      ['motor'],
      EXEC_CMD_GROUP_LABEL
    )

    // Add the positional argument of this command
    addPositional('led')

    yargs
      .example(
        '$0 led',
        'Turn off the led of all motors.'
      )
      .example(
        '$0 led green -m m3',
        'Set the led color of motor \'m3\' to \'green\'.'
      )
  },
  handler: (argv) => exec('led', argv.motor, { led: argv.value })
}]

// ////////////////////////////////
// Execute simple command
// ////////////////////////////////

const exec = async (type, motors, options = {}) => {
  const poppy = await createPoppy()

  //
  // create a poppy script...
  //

  const script = new Script()
    .select(...motors)

  script[type](...Object.values(options))

  //
  // ... and execute it
  //

  await poppy.exec(script)
}
