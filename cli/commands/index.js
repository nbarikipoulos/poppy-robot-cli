'use strict'

module.exports = [
  './config-command',
  './query-commands',
  './drive-command',
  './exec-commands',
  './admin-commands'
].map(require).flat()
