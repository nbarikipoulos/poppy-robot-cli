/*! Copyright (c) 2020-2021 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const yargs = require('yargs')

const { createRequestHandler } = require('poppy-robot-core')

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

const perform = async (
  headerMsg,
  errorMsg,
  url,
  config = {}
) => {
  const reqHandler = await createRequestHandler(getUserConfiguration())
  const hostname = reqHandler.settings.hostname

  console.log(`>> ${headerMsg} (hostname/ip: ${hostname}).`)

  const method = config.method || 'get'

  return reqHandler.perform(url, method, {
    baseURL: `http://${hostname}`,
    headers: {},
    responseType: 'text',
    ...config
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
  handler: async (argv) => perform(
    'Get Logs',
    'Unable to perform action',
    '/api/raw_logs',
    { method: 'post', data: 'id=0' }
  ).then(res => { console.log(res.data) })
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
  handler: async (argv) => perform(
    `${argv.action} robot API`,
    'Unable to perform action',
    `/api/${argv.action}`
  )
}, {
  cmd: 'reboot',
  desc: 'Reboot the Rapsberry.',
  builder: (yargs) => {
    yargs.strict()
  },
  handler: async (argv) => perform(
    'Reboot the Rapsberry',
    'Unable to reboot the Rapsberry',
    '/reboot',
    { timeout: 2000 }
  )
}, {
  cmd: 'shutdown',
  desc: 'Shutdown the Rapsberry.',
  builder: (yargs) => {
    yargs.strict()
  },
  handler: async (argv) => perform(
    'Shutdown the Rapsberry',
    'Unable to shutdown the Rapsberry',
    '/shutdown',
    { timeout: 2000 }
  )
}]
