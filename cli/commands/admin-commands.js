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

// ////////////////////////////////
// Perform the request to robot
// ////////////////////////////////

const perform = (
  connect,
  url,
  headerMsg,
  errorMsg,
  { method = 'get', config = {} } = {}
) => {
  const req = new PoppyRequestHandler(connect)

  console.log(`>> ${headerMsg}`)

  return req.perform(url, {
    method,
    config: {
      ...{ baseURL: `http://${connect.ip}` }, // hostname:8080 => hostname
      ...config
    }
  })
}

// ////////////////////////////////
// Command "descriptors"
// ////////////////////////////////

const COMMANDS = [{
  cmd: 'logs',
  desc: 'Get logs of the robot.',
  builder: (yargs) => {
    yargs.strict()
  },
  handler: async (argv) => {
    const connect = getUserConfiguration('connect')
    const inputHostname = connect.ip || DEFAULT_CONNECTION_SETTINGS.ip

    // lookup hostname, if needed
    connect.ip = await lookUp(inputHostname)

    return perform(
      connect,
      '/api/raw_logs',
      `Get Logs (hostname/ip: ${inputHostname}).`,
      'Unable to perform action',
      {
        method: 'post',
        config: { headers: {}, data: 'id=0' }
      }
    ).then(res => { console.log(res.data) })
  }
}, {
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
    yargs.strict()
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
}, {
  cmd: 'shutdown',
  desc: 'Shutdown the Rapsberry.',
  builder: (yargs) => {
    yargs.strict()
  },
  handler: async (argv) => {
    const connect = getUserConfiguration('connect')
    const inputHostname = connect.ip || DEFAULT_CONNECTION_SETTINGS.ip

    // lookup hostname, if needed
    connect.ip = await lookUp(inputHostname)

    return perform(
      connect,
      '/shutdown',
      `Shutdown the Rapsberry (hostname/ip: ${inputHostname}).`,
      'Unable to shutdown the Rapsberry'
    )
  }
}]
