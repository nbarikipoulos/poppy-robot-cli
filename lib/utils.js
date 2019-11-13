/*! Copyright (c) 2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const colors = require('colors')

const prettifyError = (level, message, ...details) => {
  let msg = ''

  let color = colors.white
  switch (level) {
    case 'ok':
      color = colors.green
      msg += color.inverse('OK')
      break
    case 'warning':
      color = colors.yellow
      msg += color.inverse('WARNING')
      break
    case 'error':
      color = colors.red
      msg += color.inverse('ERROR')
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
