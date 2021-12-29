/*! Copyright (c) 2018-2021 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path')

const treeify = require('treeify')

const { createRequestHandler, DEFAULT_CONNECTION_SETTINGS } = require('poppy-robot-core')
const { createDescriptor } = require('poppy-robot-core')

const { addOptions, getUserConfiguration } = require('../cli-helper')
const { createPrettify } = require('../../lib/utils')

const displayErr = createPrettify({ error: 'KO' })

module.exports = {
  cmd: 'config',
  desc: 'Display the Poppy motor configuration.',
  builder: (yargs) => {
    addOptions(
      ['structure', 'details'],
      'Config Options:'
    )

    // Add save CLI connection settings to the 'Poppy Settings' group
    addOptions(
      ['save'],
      'Poppy Connection Settings:'
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
  handler: (argv) => perform(argv)
}

// ////////////////////////////////
// The command itself
// ////////////////////////////////

const perform = async (argv) => {
  // Let's get settings provided by user
  const connect = getUserConfiguration()

  //
  // Check connection
  //

  const reqHandler = await createRequestHandler(connect)

  const apiOk = await checkAPI(reqHandler)

  const settings = reqHandler.settings
  const displayTest = displayErr.prettify(apiOk ? 'ok' : 'error')

  console.log(`>> Connection to Poppy (hostname/ip: ${settings.hostname})`)
  console.log(`  REST API (port ${settings.port}):\t ${displayTest}`)

  // "Early exit"
  if (!apiOk) { return }

  //
  // Display robot structure
  //

  if (argv.M) {
    const descriptor = await createDescriptor(connect)
    const structure = robotStructure(descriptor, argv.d)
    // At last, let's display result
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
    if (Object.keys(connect).length !== 0) { // i.e. do not serialize if only default data
      save(connect)
    } else {
      const msg = `${displayErr('info')} poppyrc file not created (only default settings used.)`
      console.log(`  ${msg}`)
    }
  }
}

// ////////////////////////////////
// Misc.
// ////////////////////////////////

const checkAPI = async (reqHandler) => {
  let resultOfTest = true

  try {
    await reqHandler.getAliases()
  } catch (err) {
    resultOfTest = false
  }

  return resultOfTest
}

// Filter descriptor
const robotStructure = (descriptor, showDetails) => {
  const structure = {}

  descriptor.aliases.forEach(alias => {
    structure[alias.name] = alias.motors.reduce(
      (acc, motorName) => {
        let details = null
        if (showDetails) {
          const motorDescriptor = descriptor
            .motors
            .find(m => m.name === motorName)
          details = getMotorDetails(motorDescriptor)
        }
        acc[motorName] = details
        return acc
      },
      {}
    )
  })

  return structure
}

// return { id, type, lower/upper limit }
const getMotorDetails = (motorDescriptor) => {
  const range = [
    motorDescriptor.lower_limit,
    motorDescriptor.upper_limit
  ].map(Math.round)

  return {
    id: motorDescriptor.id,
    type: motorDescriptor.model,
    angle: `[${range}]`
  }
}

const save = (connect) => fs.writeFileSync(
  path.resolve(process.cwd(), '.poppyrc'),
  JSON.stringify({ connect })
)
