/*! Copyright (c) 2019-2021 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const colors = require('colors')

const prettifyError = (level, message, ...details) => {
  let msg = ''

  switch (level) {
    case 'ok':
      msg += colors.green.inverse('OK')
      break
    case 'warning':
      msg += colors.yellow.inverse('WARNING')
      break
    case 'error':
      msg += colors.red.inverse('ERROR')
      break
    default:
      // Do nothing
      break
  }

  if (message) {
    msg += ` ${message}`
  }

  details.forEach(detail => { msg += '\n  ' + detail })

  return msg
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = { prettifyError }
