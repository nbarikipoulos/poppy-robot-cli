/*! Copyright (c) 2018-2021 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path')

const yargs = require('yargs')
const colors = require('colors')

const { createRequestHandler, DEFAULT_CONNECTION_SETTINGS } = require('poppy-robot-core')
const { createDescriptor } = require('poppy-robot-core')

const { addOptions, getUserConfiguration } = require('../cli-helper')

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
    addOptions(
      'Config Options:',
      ['robot_structure', 'motor_details']
    )

    // Add save CLI connection settings to the 'Poppy Settings' group
    addOptions(
      'Poppy Connection Settings:',
      ['saveConfig']
    )

    yargs
      .strict()
      .implies('d', 'M')
      .example(
        '$0 config',
        'Check connection to target robot using default settings' +
          `(aka ${DEFAULT_CONNECTION_SETTINGS.hostname}:${DEFAULT_CONNECTION_SETTINGS.port})`
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
  // Let's  store user's settings
  const connect = getUserConfiguration()

  //
  // Check connection
  //

  const reqHandler = await createRequestHandler(connect)
  const settings = reqHandler.settings

  let testRestAPI = true

  try {
    await reqHandler.getAliases()
  } catch (err) {
    testRestAPI = false
  }

  console.log(`>> Connection to Poppy (hostname/ip: ${settings.hostname})`)
  console.log(`  REST API (port ${settings.port}):\t ${_display(testRestAPI)}`)

  //
  // Early exit
  //

  if (!testRestAPI) { return }

  //
  // Display robot structure
  //

  if (argv.M) {
    const descriptor = await createDescriptor(settings)

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
  // Save settings
  //

  if (argv.s) {
    console.log('>> Save settings in local .poppyrc file')
    console.log('  connection settings: ', connect || 'default')
    if (Object.keys(connect).length !== 0) { // Do not serialize default data
      fs.writeFileSync(
        path.resolve(process.cwd(), '.poppyrc'),
        JSON.stringify({ connect })
      )
    } else {
      console.log(
        `  ${colors.yellow.inverse('WARNING')} poppyrc file not created (only default settings used.)`
      )
    }
  }
}

// ////////////////////////////////
// Misc.
// ////////////////////////////////

const _display = (b) => b ? colors.green.inverse('OK') : colors.red.inverse('KO')
