'use strict'

module.exports = [
  './admin-commands',
  './config-command',
  './exec-commands',
  './query-commands'
].map(require).flat()
