/*! Copyright (c) 2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

// FIXME change to json?
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
      describe: 'Invert table presentation i.e. motors are displayed as row.'
    }
  },
  compliant: {
    key: 'v',
    details: {
      alias: 'value',
      type: 'string',
      default: 'off',
      choices: [
        'on', // 'true'
        'off' // 'false' => motor is "addressable"
      ]
    }
  },
  speed: {
    key: 'v',
    details: {
      alias: 'value',
      nargs: 1,
      type: 'number',
      describe: 'Set the rotation speed of the selected motor(s).' +
        ' Value must be in the [0,1023] range.'
    }
  },
  rotate: {
    key: 'v',
    details: {
      alias: 'value',
      nargs: 1,
      type: 'number',
      describe: 'Rotate the selected motor(s) by x degrees.'
    }
  },
  position: {
    key: 'v',
    details: {
      alias: 'value',
      nargs: 1,
      type: 'number',
      describe: 'Move the selected motor(s) to a given position.'
    }
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
  led: {
    key: 'v',
    details: {
      alias: 'value',
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
  },
  ip: {
    key: 'i',
    details: {
      alias: 'ip',
      nargs: 1,
      type: 'string',
      default: 'poppy.local',
      describe: 'Set the Poppy IP/hostname.'
    }
  },
  httpPort: {
    key: 'p',
    details: {
      alias: 'http-port',
      type: 'number',
      nargs: 1,
      default: 8080,
      describe: 'Set the Poppy http server port.'
    }
  },
  snapPort: {
    key: 'P',
    details: {
      alias: 'snap-port',
      type: 'number',
      nargs: 1,
      default: 6969,
      describe: 'Set the Poppy snap server port.'
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
  saveDescriptor: {
    key: 'S',
    details: {
      alias: 'save-desc',
      type: 'string',
      nargs: 1,
      describe: 'Save discovered configuration to a descriptor file.'
    }
  }
}
