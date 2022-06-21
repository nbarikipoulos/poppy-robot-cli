'use strict'

const colors = require('colors')

class PrettifyError {
  constructor (config = {}) {
    this.ok = config.ok ?? 'OK'
    this.info = config.info ?? 'INFO'
    this.warning = config.warning ?? 'WARNING'
    this.error = config.error ?? 'ERROR'
  }

  prettify (level, message, ...details) {
    let result = ''

    switch (level) {
      case 'ok':
        result += colors.green.inverse(this.ok); break
      case 'warning':
        result += colors.yellow.inverse(this.warning); break
      case 'error':
        result += colors.red.inverse(this.error); break
      case 'info':
        result += colors.blue.inverse(this.info); break
      default: /* Do nothing */
        break
    }

    result += ' ' + (message ?? '')
    details.forEach(detail => { result += '\n  ' + detail })

    return result
  }
}

const prettifyError = (level, message, ...details) => new PrettifyError()
  .prettify(level, message, ...details)

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = {
  prettifyError, // aka for default settings
  createPrettify: (config) => new PrettifyError(config)
}
