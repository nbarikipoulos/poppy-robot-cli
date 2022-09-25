'use strict'

const {
  bgGreen: bgOK,
  bgRed: bgKO,
  bgYellow: bgWarning,
  bgBlue: bgInfo
} = require('colorette')

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
        result += bgOK(this.ok); break
      case 'warning':
        result += bgWarning(this.warning); break
      case 'error':
        result += bgKO(this.error); break
      case 'info':
        result += bgInfo(this.info); break
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
