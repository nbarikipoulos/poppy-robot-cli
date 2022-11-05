'use strict'

const readline = require('readline')
const { createScript } = require('poppy-robot-core')
const { createPoppy } = require('../../../lib/ext-poppy-factory')

const { createYargsHelper } = require('../../cli-helper')
const { prettifyError: prettify } = require('../../../lib/utils')

const getKeyBinding = require('./keys')

let ACTIONS

module.exports = {
  cmd: 'drive',
  desc: 'Drive robot with keyboard.',
  builder: (yargs) => {
    const helper = createYargsHelper(yargs)

    helper.addOptions(['angle', 'speed', 'light'], 'Settings:')
      .addConnectionOptionsGroup()
      .yargs
      .strict()
      .example(
        '$0 drive -l off',
        'Deactivate led on motor selection.'
      )
  },
  handler: (argv) => drive({
    speed: argv.speed,
    angle: argv.angle,
    led: argv.light
  })
}

// ////////////////////////////////
// Command
// ////////////////////////////////

let INSTANCE
let rl

const drive = (config) => createPoppy()
  .then(async poppy => {
    // t0 settings for poppy
    await poppy.exec(
      createScript('all')
        .speed(config.speed)
        .led('off')
        .stiff()
    )

    // Init key binding
    ACTIONS = getKeyBinding(poppy.descriptor, config)

    // Poppy handler
    INSTANCE = new PoppyHandler(poppy, config)

    // Main job

    readline.emitKeypressEvents(process.stdin)
    process.stdin.setRawMode(true)
    process.stdin.on('keypress', keyListener)

    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.on('line', async line => {
      const action = ACTIONS.find(action => action.isMatching(line.trim()))

      if (action) {
        let msg
        try {
          msg = await action.cb(INSTANCE)
        } catch (error) { msg = prettify('info', error.message) }

        console.log(msg)
      }

      rl.prompt()
    }).on('close', async _ => {
      await INSTANCE.poppy.exec( // !t0
        createScript('all').compliant().led('off')
      )
      console.log('See you soon.')
    })

    console.log('Type ?/help to display help.')
    rl.prompt()
  })

// ////////////////////////////////////
// Utilities
// ////////////////////////////////////

// Handle poppy instance & selected motors.
class PoppyHandler {
  constructor (poppy, config) {
    this._poppy = poppy
    this._config = config
  }

  get poppy () { return this._poppy }

  get motors () {
    return this._motors === 'all'
      ? this.poppy.motorNames
      : this._motors
  }

  set motors (motors) {
    if (this._config.led !== 'off') {
      const script = createScript(this._motors ?? 'all')
        .led('off')
        .select(motors)
        .led(this._config.led)
      this.poppy.exec(script) // !t0
    }

    this._motors = motors
  }

  exec (script) {
    if (this._motors === undefined) {
      throw new Error('Select at least one motor.')
    }

    return this.poppy.exec(script)
  }
}

// ////////////////////////////////////
// Key listener
// ////////////////////////////////////

const keyListener = async (str, key) => {
  if (rl.line.length) { // Early exit
    return
  }

  const action = ACTIONS.find(action => action.isKeyMatching(str, key))
  if (action) {
    await readline.clearLine(process.stdout, 0)
    await readline.cursorTo(process.stdout, -1)
    rl.write(null, { ctrl: true, name: 'u' })
    rl.write(`${action.id}\n`)
  }
}
