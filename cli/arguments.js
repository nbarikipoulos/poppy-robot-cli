'use strict'

const { DEFAULT_SETTINGS } = require('poppy-robot-core')

// first, check 'alias'. On a second hand, use 'key' (for positional)
const get = (name) => ARGS.find(arg => arg.opt?.alias === name || arg.key === name)

const ARGS = [{
  key: 'm',
  opt: {
    alias: 'motor',
    type: 'array',
    default: 'all',
    choices: ['all'], // overriden by cliBuilderHelper.init(poppy)
    describe: 'Name of the target motor(s). Type \'all\' to select all available motors.'
  }
}, {
  key: 'r',
  opt: {
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
}, {
  key: 'I',
  opt: {
    alias: 'invert',
    type: 'boolean',
    default: false,
    describe: 'Invert table presentation.'
  }
}, {
  key: 't',
  opt: {
    alias: 'tree',
    type: 'boolean',
    default: false,
    describe: 'Display result as tree.'
  }
}, {
  key: 'speed_positional', // positional
  opt: {
    type: 'number',
    describe: 'Set the rotation speed of the selected motor(s).' +
      ' Value must be in the [0,1023] range.'
  }
}, {
  key: 'rotate', // positional
  opt: {
    type: 'number',
    describe: 'Rotate the selected motor(s) by x degrees.'
  }
}, {
  key: 'goto', // positional
  opt: {
    type: 'number',
    describe: 'Move the selected motor(s) to a given angle.'
  }
}, {
  key: 'd',
  opt: {
    alias: 'duration',
    type: 'number',
    describe: 'Set-up duration of the movement (in s.)'
  }
}, {
  key: 'w',
  opt: {
    alias: 'wait',
    type: 'boolean',
    default: false,
    describe: 'Wait until this command is finished.'
  }
}, {
  key: 'led', // positional
  opt: {
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
  }
}, {
  key: 's',
  opt: {
    alias: 'speed',
    type: 'number',
    default: 150,
    describe: 'Set speed of all motors.'
  }
}, {
  key: 'a',
  opt: {
    alias: 'angle',
    type: 'number',
    default: 10,
    describe: 'Value of the angle for rotation actions.'
  }
}, {
  key: 'H',
  opt: {
    alias: 'host',
    nargs: 1,
    type: 'string',
    default: DEFAULT_SETTINGS.host,
    describe: 'Hostname/IP of targeted Poppy.'
  }
}, {
  key: 'p',
  opt: {
    alias: 'port',
    type: 'number',
    nargs: 1,
    default: DEFAULT_SETTINGS.port,
    describe: 'Set the port of the pypot REST API.'
  }
}, {
  key: 's',
  opt: {
    alias: 'save',
    type: 'boolean',
    default: false,
    describe: 'Save connection settings to .poppyrc file'
  }
}, {
  key: 'M',
  opt: {
    alias: 'structure',
    type: 'boolean',
    default: false,
    describe: 'Display the robot structure (aliases and motors) and check connection to each motors.'
  }
}, {
  key: 'D',
  opt: {
    alias: 'details',
    type: 'boolean',
    default: false,
    describe: 'Display details about motor'
  }
}, {
  key: 'api', // positional
  opt: {
    type: 'string',
    default: 'reset',
    choices: [
      'start',
      'reset',
      'stop'
    ],
    describe: 'Start/Reset/Stop robot API.'
  }
}]

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = { get }
