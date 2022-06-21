'use strict'

const { createRequestHandler } = require('../../lib/ext-poppy-factory')

const { addPositional } = require('../cli-helper')

module.exports = [{
  cmd: 'logs',
  desc: 'Get logs of the robot.',
  builder: (yargs) => yargs.strict(),
  handler: async (argv) => perform(
    'Get Logs',
    '/api/raw_logs',
    { method: 'post', data: 'id=0' }
  ).then(res => { console.log(res.data) })
}, {
  cmd: 'api [action]',
  desc: 'Start/Reset/Stop the robot API.',
  builder: (yargs) => {
    // Add the positional argument of this command
    addPositional('api')

    yargs
      .strict()
      .example('$0 api', 'Reset the robot API.')
      .example('$0 api stop', 'Stop the robot API.')
  },
  handler: async (argv) => perform(
    `${argv.action} robot API`,
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
    '/reboot',
    { timeout: 2000 }
  )
}, {
  cmd: 'shutdown',
  desc: 'Shutdown the Rapsberry.',
  builder: (yargs) => {
    yargs.strict()
  },
  handler: (argv) => perform(
    'Shutdown the Rapsberry',
    '/shutdown',
    { timeout: 2000 }
  )
}]

// ////////////////////////////////
// Perform 'admin' request to robot
// ////////////////////////////////

const perform = async (
  headerMsg,
  url,
  axiosConfig = {}
) => {
  const reqHandler = await createRequestHandler()

  const host = reqHandler.settings.host

  console.log(`>> ${headerMsg} (hostname/IP: ${host}).`)

  const method = axiosConfig.method || 'get'

  return reqHandler.perform(url, method, {
    baseURL: `http://${host}`,
    headers: {},
    responseType: 'text',
    ...axiosConfig
  })
}
