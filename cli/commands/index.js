'use strict'

module.exports = [
  './config-command',
  './query-commands',
  './exec-commands',
  './admin-commands'
].map(require).flat()
