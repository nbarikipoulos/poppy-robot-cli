/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path')

const yargs = require('yargs')

const PoppyRequestHandler = require('poppy-robot-core').PoppyRequestHandler

const cliBuilderHelper = require('../cli-helper')

const Status = require('../../tools/status')
const createStatus = Status.createStatus
const StatusEnum = Status.StatusEnum
const toTree = require('../../tools/tree').toTree

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
      'Query Options:',
      ['motorConf', 'saveDescriptor', 'all']
    )

    // Add save CLI connection settings to the 'Poppy Settings' group
    cliBuilderHelper.addOptions(
      'Poppy Connection Settings:',
      ['saveConfig']
    )

    yargs
      .strict()
      .example(
        '$0 config',
        'Check connection settings.'
      )
      .example(
        '$0 config -M',
        'Check connection settings and display the robot descriptor (i.e. the motor configuration).'
      )
      .example(
        '$0 config -S myPoppy.json',
        'Save the descriptor of target robot in local json file'
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
  // Get the already instantiated poppy
  const poppy = cliBuilderHelper.getPoppyInstance()

  const configObject = cliBuilderHelper.getUserConfiguration()

  // Let's instantiate a new request handler object
  // with user's connexion settings.
  const requestHandler = new PoppyRequestHandler(configObject.connect)
  const cnxSettings = requestHandler.getSettings() // full cnx settings

  //
  // First of all, let check connexion settings
  //

  console.log(`>> Connection to Poppy (hostname/ip: ${cnxSettings.ip})`)

  const cnxStatus = await _basicConnectionTest(requestHandler)

  console.log(`  Http server (port ${cnxSettings.httpPort}):\t ${cnxStatus.http.display()}`)
  console.log(`  Snap server (port ${cnxSettings.snapPort}):\t ${cnxStatus.snap.display()}`)

  //
  // On a second hand, let's discover/display/validate configuration, if asked
  //

  const validate = argv.v
  const displayMotor = argv.M

  const displayMotorConfiguration = validate || displayMotor

  if (displayMotorConfiguration) {
    if ( // Early exit
      !cnxStatus.http.isOk()
    ) {
      console.log(
        '>> Unable to discover the motor configuration of the Robot.' +
        '  Please check connection settings.'
      )
      process.exit()
    }

    let source
    let mStatusObject = {}

    // if (0) {
    //   source = 'live discovering'
    //   descriptor = await _discoverDescriptor(requestHandler)
    //   // We just connect to all available motors then all is ok
    //   descriptor.motors.forEach(
    //     motor => { mStatusObject[motor.name] = createStatus(StatusEnum.ok) }
    //   )
    // } else { // Get info from the descriptor file
    //   source = configObject.descriptor ||
    //     'default configuration'

    const descriptor = poppy.getDescriptor()

      // Should the descriptor be validated?
      mStatusObject = {}
    // }


    if (argv.S) {
      fs.writeFileSync(
        path.resolve(process.cwd(), argv.S),
        JSON.stringify(descriptor)
      )
      configObject.descriptor = `file://${argv.S}`
    }

    console.log(`>> Poppy motors: from ${source}`)

    const poppyStatus = validate
      ? `${cnxStatus.http.display()}`
      : ''

    console.log(`Poppy ${poppyStatus}`)
    console.log(
      treeify(descriptor, mStatusObject, argv.a)
    )
  }

  //
  // At last, the save setting options
  //

  if (argv.s) {
    console.log('>> Save settings in local .poppyrc file')

    const desc = configObject.descriptor
      ? configObject.descriptor
      : 'default descriptor'

    console.log(`  descriptor: ${desc}`)

    const cnx = configObject.connect
    if (cnx && Object.keys(cnx).length !== 0) {
      console.log('  connection settings:')
      for (const p in cnx) {
        console.log(`    ${p}= ${cnx[p]}`)
      }
    } else {
      console.log('  connection settings: default')
    }

    fs.writeFileSync(
      path.resolve(process.cwd(), '.poppyrc'),
      JSON.stringify(configObject)
    )
  }

  // It seems to be an axios issue: when a request raises a connection error,
  // a Promise still exists somewhere and we await until the timeout will be reached.
  process.exit()
}

// ////////////////////////////////
// Check connection settings.
// ////////////////////////////////

const _basicConnectionTest = async (requestHandler) => {
  const result = Object.create(null)

  // Next to switch on, the first request always failed.
  // Then, Let perform a dummy one at every call of this command...
  await _dummyHttpRequest(requestHandler)

  //
  // Test the http server
  //
  result.http = await _dummyHttpRequest(requestHandler)

  //
  // Test snap settings, if http test succeeds
  //
  if (result.http.isOk()) {
    // Let's get a motor Id to test the snap connexion settings
    const alias = (await requestHandler.getAliases()).alias
      .shift() // Let get first alias

    const motorId = (await requestHandler.getAliasMotors(alias)).alias
      .shift() // ... and is first motor

    result.snap = await _ledSnapRequest(requestHandler, motorId)
  } else {
    result.snap = createStatus(StatusEnum.error, 'Unable to connect')
  }

  return result
}

const _dummyHttpRequest = async (requestHandler) => {
  let status

  try {
    await requestHandler.getAliases()
    status = createStatus(StatusEnum.ok)
  } catch (e) { status = createStatus(StatusEnum.error, 'Unable to connect') }

  return status
}

const _ledSnapRequest = async (requestHandler, motorId) => {
  let status

  // We need a motor to test it
  try {
    await requestHandler.led(motorId, 'off')
    status = createStatus(StatusEnum.ok)
  } catch (e) { status = createStatus(StatusEnum.error, 'Unable to connect') }

  return status
}

// ////////////////////////////////
// Display misc.
// ////////////////////////////////

const treeify = (descriptor, mStatusObject, showDetails) => toTree(
  tr(descriptor),
  (property, parent) => {
    let status
    try {
      if (
        ['lower_limit', 'upper_limit'].includes(property)
      ) {
        status = mStatusObject[parent.name]
          .getChildren() // Get the sub-statuses for this property
          .find(status => property === status.id)
      } else {
        status = mStatusObject[property] // for motor
      }
    } catch (e) { /* Do nothing */ }

    return status ? status.display(true) : ''
  },
  {
    onlyObject: !showDetails,
    filter: (property) => property !== 'name'
  }
)

const tr = (descriptor) => {
  const result = {}

  descriptor.aliases.forEach(alias => {
    const aliasObject = {}

    alias.motors.forEach(motor => {
      aliasObject[motor] = Object.assign(
        {},
        descriptor.motors.find(elt => motor === elt.name)
      )
    })
    result[alias.name] = aliasObject
  })

  return result
}
