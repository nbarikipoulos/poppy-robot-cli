'use strict'

const readline = require('readline')
const { createScript } = require('poppy-robot-core')

const { addConnectionOptionsGroup, addOptions } = require('../../cli-helper')
const { createPoppy } = require('../../../lib/ext-poppy-factory')

const getKeyBinding = require('./keys')

let ACTIONS

module.exports = {
  cmd: 'drive',
  desc: 'Drive robot with keyboard.',
  builder: (yargs) => {
    addOptions(
      ['angle', 'speed'],
      'Settings:'
    )

    addConnectionOptionsGroup()

    yargs.strict()
  },
  handler: (argv) => drive({ speed: argv.speed, angle: argv.angle })
}

// ////////////////////////////////
// Command
// ////////////////////////////////

let INSTANCE
let rl

const drive = (config) => createPoppy()
  .then(async poppy => {
    INSTANCE = new PoppyHandler(poppy)

    await INSTANCE.exec(
      createScript('all')
        .speed(config.speed)
        .stiff()
    )

    // Init key binding
    ACTIONS = getKeyBinding(poppy.descriptor, config)

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
        const msg = await action.cb(INSTANCE)
        console.log(msg)
      }

      rl.prompt()
    }).on('close', async _ => {
      await INSTANCE.exec(
        createScript('all').compliant()
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
  constructor (poppy) {
    this._poppy = poppy
    this._motors = 'all'
  }

  get poppy () { return this._poppy }

  get motors () {
    return this._motors === 'all'
      ? this.poppy.motorNames
      : this._motors
  }

  set motors (motors) { this._motors = motors }

  exec (script) { return this._poppy.exec(script) }
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
