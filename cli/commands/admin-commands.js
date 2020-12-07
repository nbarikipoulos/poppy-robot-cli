/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const yargs = require('yargs')

const { PoppyRequestHandler, DEFAULT_CONNECTION_SETTINGS } = require('poppy-robot-core')
const { lookUp } = require('poppy-robot-core/util/misc')

const { getArgDesc, getUserConfiguration } = require('../cli-helper')

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

const perform = async (connect, url, headerMsg, errorMsg) => {
  const req = new PoppyRequestHandler(connect)
  console.log(`>> ${headerMsg}`)
  try {
    await req.perform(url, {
      config: { // override base url poppy.local:8080 => poppy.local
        baseURL: `http://${connect.ip}`
      }
    })
  } catch (err) {
    console.log(`  ${errorMsg}`)
  }
}

// ////////////////////////////////
// Command "descriptors"
// ////////////////////////////////

const COMMANDS = [{
  cmd: 'api [action]',
  desc: 'Start/Reset/Stop the robot API.',
  builder: (yargs) => {
    // Add the positional argument of this command
    const desc = getArgDesc('api')
    yargs.positional('action', desc)

    yargs
      .strict()
      .example('$0 api', 'Reset the robot API.')
      .example('$0 api stop', 'Stop the robot API.')
  },
  handler: async (argv) => {
    const connect = getUserConfiguration('connect')
    const inputHostname = connect.ip || DEFAULT_CONNECTION_SETTINGS.ip

    // lookup hostname, if needed
    connect.ip = await lookUp(inputHostname)

    const action = argv.action

    return perform(
      connect,
      `/api/${action}`,
      `${action} robot API (hostname/ip: ${inputHostname}).`,
      'Unable to perform action'

    )
  }
}, {
  cmd: 'reboot',
  desc: 'Reboot the Rapsberry.',
  builder: (yargs) => {
    yargs
      .strict()
  },
  handler: async (argv) => {
    const connect = getUserConfiguration('connect')
    const inputHostname = connect.ip || DEFAULT_CONNECTION_SETTINGS.ip

    // lookup hostname, if needed
    connect.ip = await lookUp(inputHostname)

    return perform(
      connect,
      '/reboot',
      `Reboot the Rapsberry (hostname/ip: ${inputHostname}).`,
      'Unable to reboot the Rapsberry'
    )
  }
}]
