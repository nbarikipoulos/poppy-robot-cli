/*! Copyright (c) 2019-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { DEFAULT_CONNECTION_SETTINGS } = require('poppy-robot-core')

module.exports = {
  motor: {
    key: 'm',
    details: {
      alias: 'motor',
      type: 'array',
      default: 'all',
      choices: ['all'], // overriden by cliBuilderHelper.init(poppy)
      describe: 'Name of the target motor(s). Type \'all\' to select all available motors.'
    }
  },
  register: {
    key: 'r',
    details: {
      alias: 'register',
      type: 'array',
      default: [
        'compliant',
        'lower_limit',
        'present_position',
        'goal_position',
        'upper_limit',
        'moving_speed',
        'present_temperature'
      ],
      choices: [
        'compliant',
        'lower_limit',
        'present_position',
        'goal_position',
        'upper_limit',
        'moving_speed',
        'present_temperature',
        'led'
      ],
      describe: 'Select register value(s).'
    }
  },
  invert: {
    key: 'I',
    details: {
      alias: 'invert',
      type: 'boolean',
      default: false,
      describe: 'Invert table presentation.'
    }
  },
  tree: {
    key: 't',
    details: {
      alias: 'tree',
      type: 'boolean',
      default: false,
      describe: 'Display result as tree.'
    }
  },
  speed: { // positional
    type: 'number',
    describe: 'Set the rotation speed of the selected motor(s).' +
      ' Value must be in the [0,1023] range.'
  },
  rotate: { // positional
    type: 'number',
    describe: 'Rotate the selected motor(s) by x degrees.'
  },
  position: { // positional
    type: 'number',
    describe: 'Move the selected motor(s) to a given position.'
  },
  wait: {
    key: 'w',
    details: {
      alias: 'wait',
      type: 'boolean',
      default: false,
      describe: 'Wait until this command is finished.'
    }
  },
  led: { // positional
    type: 'string',
    default: 'off',
    choices: [
      'off',
      'red',
      'green',
      'blue',
      'yellow',
      'cyan',
      'pink',
      'white'
    ],
    describe: 'The led color (or turn-off) value.'
  },
  ip: {
    key: 'i',
    details: {
      alias: 'ip',
      nargs: 1,
      type: 'string',
      default: DEFAULT_CONNECTION_SETTINGS.ip,
      describe: 'Set the Poppy IP/hostname.'
    }
  },
  port: {
    key: 'p',
    details: {
      alias: 'port',
      type: 'number',
      nargs: 1,
      default: DEFAULT_CONNECTION_SETTINGS.port,
      describe: 'Set the port to the REST API served by the http server.'
    }
  },
  saveConfig: {
    key: 's',
    details: {
      alias: 'save',
      type: 'boolean',
      default: false,
      describe: 'Save connection settings to a local .poppyrc file'
    }
  },
  robot_structure: {
    key: 'M',
    details: {
      alias: 'robot-structure',
      type: 'boolean',
      default: false,
      describe: 'Display the robot structure (aliases and motors) and check connection to each motors.'
    }
  },
  motor_details: {
    key: 'd',
    details: {
      alias: 'details',
      type: 'boolean',
      default: false,
      describe: 'Display details about motor'
    }
  }
}
