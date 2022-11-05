'use strict'

const Table = require('cli-table')
const { bgBlue, bgGreen } = require('colorette')
const { createScript } = require('poppy-robot-core')

module.exports = (descriptor, config) => {
  // shortcuts for motor based on id: if id > 10 => disabled
  const shortcut = descriptor.motors.every(motor => motor.id < 10)

  const actions = [
    aliases(descriptor),
    ...selectAliases(descriptor),
    selectAllMotors,
    ...selectMotors(descriptor, shortcut),
    rotPlus(config),
    rotMinus(config),
    rest(config.speed),
    zero(config.speed),
    query
  ]

  // For displaying help purpose
  // Add 'dummy' actions for keys from readline

  const dummyAction = (desc, keys) => createCmd(
    desc,
    [],
    _ => { /* Do nothing */ },
    createShortcut(keys, _ => false)
  )

  actions.push(
    dummyAction('History', ['up', 'down']),
    dummyAction('Exit', ['CTRL+C'])
  )

  // At last help action

  const h = help(actions)
  actions.push(h)

  return actions
}

// ////////////////////////////////////
// Utility functions
// ////////////////////////////////////

class Action {
  constructor (
    desc,
    keys,
    cb,
    shortcut
  ) {
    this._desc = desc
    this._keys = keys
    this._cb = cb
    this._shortcut = shortcut
  }

  get desc () { return this._desc }
  get keys () { return this._keys || [] }
  get cb () { return this._cb }
  get shortcut () { return this._shortcut }

  get hasKey () { return this.keys && this.keys.length }
  get hasShorcut () { return this.shortcut ?? false }

  get id () { return this.keys[0] ?? this.shortcut.keys[0] }

  isKeyMatching (str, key) { return this.shortcut?.test(str, key) }

  isMatching (str) {
    return this.keys.includes(str) ||
      this.shortcut?.keys.includes(str)
  }
}

const createCmd = (desc, keys, cb, shortcut) => new Action(desc, keys, cb, shortcut)
const createShortcut = (keys, test) => ({ keys, test })

// ////////////////////////////////////
// Actions
// ////////////////////////////////////

//
// Select aliases
//

const selectAliases = (descriptor) => descriptor.aliases.map(alias => {
  const name = alias.name
  const motors = alias.motors

  const desc = `Select motors of alias '${name}'`
  const cb = (p) => {
    p.motors = motors
    return `Motors ${motors} selected`
  }

  return createCmd(desc, [name], cb)
})

//
// Display aliases/motors
//

const aliases = (descriptor) => {
  const desc = 'Display list aliases/motors'

  const cb = (p) => {
    const table = new Table({ head: ['alias', 'motors'] })

    descriptor.aliases.forEach(alias => table.push(
      [alias.name, alias.motors]
    ))

    return table.toString()
  }

  return createCmd(desc, ['aliases'], cb)
}

//
// Select all motors
//

const selectAllMotors = createCmd(
  'Select all motors',
  ['all'],
  (p) => {
    p.motors = ['all']
    return 'All motors selected'
  },
  createShortcut(['A'], (str, key) => str === 'A')
)

//
// Select motor
//

const selectMotors = (descriptor, addShortcut) => descriptor.motors.map(motor => {
  const id = motor.id
  const name = motor.name

  let shortcut
  const names = [name]

  if (addShortcut) {
    shortcut = createShortcut([id], (str, key) => String.fromCharCode(48 + id) === str)
  } else { // put id in names
    names.push(id.toString())
  }

  const cb = (p) => {
    p.motors = [name]
    return `Motor ${name} selected`
  }

  return createCmd(
    `Select motor ${name}`,
    names,
    cb,
    shortcut
  )
})

//
// Rotate by +DEGREES
//

const rotPlus = (config) => {
  const desc = `Rotate selected motor(s) by ${config.angle} degrees`

  const cb = (p) => p.exec(
    createScript(p.motors)
      .rotate(config.angle, true)
      .speed(config.speed)
  ).then(_ => `Motor(s) '${p.motors}' rotated by ${config.angle} degrees`)

  const shorcut = createShortcut(
    ['+', 'right'],
    (str, key) => key.name === 'right' || str === '+'
  )

  return createCmd(desc, [], cb, shorcut)
}

//
// Rotate by -DEGREES
//

const rotMinus = (config) => {
  const desc = `Rotate selected motor(s) by -${config.angle} degrees`

  const cb = (p) => p.exec(
    createScript(p.motors)
      .rotate(0 - config.angle, true)
      .speed(config.speed)
  ).then(_ => `Motor(s) '${p.motors}' rotated by -${config.angle} degrees`)

  const shortcut = createShortcut(
    ['-', 'left'],
    (str, key) => key.name === 'left' || str === '-'
  )

  return createCmd(desc, [], cb, shortcut)
}

//
// Help
//

const help = (actions) => {
  const desc = 'Display help'

  const cb = (p) => {
    const table = new Table({ head: ['cmd', 'shorcut', 'desc.'] })

    const fn = (list, bg) => list.map(elt => bg(` ${elt} `)).join()

    for (const action of actions) {
      const names = fn(action.keys, bgGreen)
      const shortcuts = action.shortcut
        ? fn(action.shortcut.keys, bgBlue)
        : ''

      table.push([
        names, // action.keys,
        shortcuts,
        action.desc
      ])
    }

    return table.toString()
  }

  const shortcut = createShortcut(['?'], (str, key) => str === '?')

  return createCmd(desc, ['help'], cb, shortcut)
}

//
// Query present position
//

const query = createCmd(
  'Display position of motors',
  ['query'],
  (p) => p.poppy.query({ registers: ['present_position'] })
    .then(res => {
      const table = new Table({ head: Object.keys(res) })
      table.push(
        Object.values(res).map(o => Math.round(o.present_position))
      )
      return table.toString()
    }),
  createShortcut(['Q'], (str, key) => str === 'Q')
)

//
// Selected motors to position 0
//

const zero = (speed) => createCmd(
  'Move selected motors to position 0',
  ['zero'],
  (p) => p.exec(
    createScript(p.motors)
      .goto(0, true)
      .speed(speed)
  ).then(_ => `motors ${p.motors} moved to position 0`),
  createShortcut(['O'], (str, key) => str === 'O')
)

//
// Rest position
//

const rest = (speed) => createCmd(
  'To rest position (Poppy Ergo Jr only)',
  ['rest'],
  (p) => p.exec(
    createScript('all')
      .goto([0, -90, 90, 0, -90, 0], true)
      .speed(speed) // back to speed
  ).then(_ => 'Moved to \'rest\' position'),
  createShortcut(['R'], (str, key) => str === 'R')
)
