/*! Copyright (c) 2021 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

module.exports = [
  './admin-commands',
  './config-command',
  './exec-commands',
  './query-commands'
].map(require).flat()
