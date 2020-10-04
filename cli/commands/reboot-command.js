/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const yargs = require('yargs')

const { PoppyRequestHandler, DEFAULT_CONNECTION_SETTINGS } = require('poppy-robot-core')
const { lookUp } = require('poppy-robot-core/util/misc')

const { getUserConfiguration } = require('../cli-helper')

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = _ => yargs.command(
  'reboot',
  'Reboot the robot.',
  (yargs) => yargs
    .strict()
    .example('$0 reboot', 'Reboot the robot.'),
  handler
)

// ////////////////////////////////
// ////////////////////////////////
// Private
// ////////////////////////////////
// ////////////////////////////////

// ////////////////////////////////
// The command itself
// ////////////////////////////////

const handler = async (argv) => {
  //
  // First, get hostname/ip of the robot
  //

  const connect = getUserConfiguration('connect')
  const inputIp = connect.ip ? connect.ip : DEFAULT_CONNECTION_SETTINGS.ip

  // lookup hostname, if needed
  const ip = await lookUp(connect.ip)
  connect.ip = ip

  //
  // Main job
  //

  const req = new PoppyRequestHandler(connect)
  console.log(`>> Reboot Poppy located at ${inputIp}.`)
  try {
    await req.perform('/reset', {
      config: { // override base url poppy.local:8080 => poppy.local
        baseURL: `http://${connect.ip}`
      }
    })
  } catch (err) {
    console.log('  Unable to perform reset')
    process.exit(1)
  }
  console.log('   Done.')
}
