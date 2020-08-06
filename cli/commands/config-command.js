/*! Copyright (c) 2018-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path')

const yargs = require('yargs')
const colors = require('colors')

const PoppyRequestHandler = require('poppy-robot-core').PoppyRequestHandler
const createDescriptor = require('poppy-robot-core').createDescriptor
const lookUp = require('poppy-robot-core/util/misc').lookUp
const DEFAULT_CONNECTION_SETTINGS = require('poppy-robot-core').DEFAULT_CONNECTION_SETTINGS

const cliBuilderHelper = require('../cli-helper')

const treeify = require('treeify')

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = _ => yargs.command(
  'config',
  'Display the Poppy motor configuration.',
  (yargs) => {
    cliBuilderHelper.addOptions(
      'Config Options:',
      ['robot_structure', 'motor_details']
    )

    // Add save CLI connection settings to the 'Poppy Settings' group
    cliBuilderHelper.addOptions(
      'Poppy Connection Settings:',
      ['saveConfig']
    )

    yargs
      .strict()
      .implies('d', 'M')
      .example(
        '$0 config',
        'Check connection to target robot using default settings' +
          `(aka ${DEFAULT_CONNECTION_SETTINGS.ip}:${DEFAULT_CONNECTION_SETTINGS.port})`
      )
      .example(
        '$0 config --ip poppy1.local -s',
        'Check connection to robot with hostname \'poppy1.local\' and save settings to .poppyrc file'
      )
      .example(
        '$0 config -M',
        'Check connection and display the robot info/structure'
      )
  },
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
  // Check connection
  //

  const config = cliBuilderHelper.getUserConfiguration()

  const connect = Object.assign({}, config.connect)

  const inputIp = connect.ip ? connect.ip : DEFAULT_CONNECTION_SETTINGS.ip

  // lookup hostname, if needed
  const ip = await lookUp(connect.ip)
  connect.ip = ip

  const req = new PoppyRequestHandler(connect)
  const fulfilled = (p) => p.then(_ => true, _ => false) // arf...

  // A first dummy request is mandatory
  // The first request once the robot is turned on always terminates in timeout
  // see https://forum.poppy-project.org/t/api-rest-poppy-ergo-jr/3516/16
  await req.perform('/motor/alias/list.json').catch(e => { /* Do nothing */ })

  const testRestAPI = await fulfilled(req.perform('/motor/alias/list.json'))

  console.log(`>> Connection to Poppy (hostname/ip: ${inputIp})`)
  console.log(`  REST API (port ${req.getSettings().port}):\t ${_display(testRestAPI)}`)

  //
  // display robot structure
  //

  if (argv.M) {
    const descriptor = await createDescriptor(connect)

    const structure = {}

    descriptor.aliases.forEach(alias => {
      structure[alias.name] = alias.motors.reduce(
        (acc, motorName) => {
          let details = null
          if (argv.d) {
            const mDescriptor = descriptor.motors.find(m => m.name === motorName)
            const range = [
              mDescriptor.lower_limit,
              mDescriptor.upper_limit
            ].map(Math.round)
            details = {
              id: mDescriptor.id,
              type: mDescriptor.model,
              angle: `[${range}]`
            }
          }
          acc[motorName] = details
          return acc
        },
        {}
      )
    })

    // At last, let display it

    let tree = ' Poppy\n'
    treeify.asLines(structure, true, (line) => { tree += `   ${line}\n` })

    console.log('>> Structure:', '\n', tree)
  }

  //
  // At last, Save settings
  //

  if (argv.s) {
    // Do not serialize empty data...
    if (!config.connect || Object.keys(config.connect).length === 0) {
      delete config.connect
    }

    console.log('>> Save settings in local .poppyrc file')
    console.log('  connection settings: ', config.connect || 'default')
    if (Object.keys(config).length !== 0) { // Do not serialize default data
      fs.writeFileSync(
        path.resolve(process.cwd(), '.poppyrc'),
        JSON.stringify(config)
      )
    } else {
      const msg = '  ' + colors.yellow.inverse('WARNING') +
        ' poppyrc file not created (only default settings.)'
      console.log(msg)
    }
  }
}

// ////////////////////////////////
// Misc.
// ////////////////////////////////

const _display = (b) => b ? colors.green.inverse('OK') : colors.red.inverse('KO')
