/*! Copyright (c) 2018-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs')
const path = require('path')

const yargs = require('yargs')
const colors = require('colors')

const PoppyRequestHandler = require('poppy-robot-core').PoppyRequestHandler
const createDescriptor = require('poppy-robot-core').createDescriptor
const promiseAll = require('poppy-robot-core/util/misc').promiseAll
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
      'Query Options:',
      ['robot_structure', 'saveDescriptor']
    )

    // Add save CLI connection settings to the 'Poppy Settings' group
    cliBuilderHelper.addOptions(
      'Poppy Connection Settings:',
      ['saveConfig']
    )

    yargs
      .strict()
      .implies('S', 'M')
      .example(
        '$0 config',
        'Check global connection settings (hostname and ports).'
      )
      .example(
        '$0 config --ip poppy1.local -s',
        'Check connection settings using user\'s ones and save it to local .poppyrc file'
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
  //
  // Check connection (http and snap server)
  //

  const config = cliBuilderHelper.getUserConfiguration()

  const connect = Object.assign({}, config.connect)

  const inputIp = connect.ip ? connect.ip : DEFAULT_CONNECTION_SETTINGS.ip

  // lookup hostname, if needed
  const ip = await lookUp(connect.ip)
  connect.ip = ip

  let req = new PoppyRequestHandler(connect)

  const fulfilled = (p) => p.then(_ => true, _ => false) // arf...

  // A first dummy request is mandatory
  // The first request once the robot is turned on always terminates in timeout
  // see https://forum.poppy-project.org/t/api-rest-poppy-ergo-jr/3516/16
  await req.perform('/motor/alias/list.json').catch(e => { /* Do nothing */ })

  const [port, snap] = (await Promise.all([
    fulfilled(req.perform('/motor/alias/list.json')),
    fulfilled(req.perform('/motors/alias', { client: 'snap' }))
  ]))

  console.log(`>> Connection to Poppy (hostname/ip: ${inputIp})`)
  console.log(`  REST API: (port ${req.getSettings().port}):\t ${_display(port)}`)
  console.log(`  Snap server (port ${req.getSettings().snapPort}):\t ${_display(snap)}`)

  //
  // display robot structure
  //

  if (argv.M) {
    const isLive = !config.locator || config.locator === 'desc://live-discovering'

    const descriptor = await createDescriptor(config.locator, connect)
    const motorIds = descriptor.motors.map(m => m.name)

    let res // array with result of connection to motors
    // Test connection to each motor, if needed (i.e. no live discovering performed)
    if (!isLive) {
      // Discover the robot descriptor
      req = new PoppyRequestHandler(connect)

      res = await promiseAll(motorIds, async (name) => {
        const res = await fulfilled(
          req.perform(`/motor/${name}/register/list.json`)
        )
        return _display(res)
      })
    } else {
      res = Array(motorIds.length).fill(_display(true))
    }

    // Then let's gather connection results with the poppy structure

    const structure = {}

    descriptor.aliases.forEach(alias => {
      structure[alias.name] = alias.motors.reduce(
        (acc, elt, i) => { acc[elt] = res[i]; return acc },
        {}
      )
    })

    // At last, let display it

    let tree = ' Poppy\n'
    treeify.asLines(structure, true, (line) => { tree += `   ${line}\n` })

    const header = '>> Structure: from ' +
     (isLive ? 'live discovering' : config.locator)

    console.log(header, '\n', tree)

    if ( // argv.S implies M one
      argv.S &&
      isLive // only for live discovering, otherwise, what's the point...
    ) {
      fs.writeFileSync(
        path.resolve(process.cwd(), argv.S),
        JSON.stringify(descriptor)
      )
      config.locator = `file://${argv.S}`
    }
  }
  //
  // At last, the save setting option
  //

  if (argv.s) {
    // Do not serialize empty data...
    if (!config.connect || Object.keys(config.connect).length === 0) {
      delete config.connect
    }

    console.log('>> Save settings in local .poppyrc file')
    console.log('  descriptor:', config.locator || 'default (live discovering)')
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
