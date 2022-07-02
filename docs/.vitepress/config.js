'use strict'

// /////////////////////////
// NavBar
// /////////////////////////

const nav = _ => [
  { text: 'CLI', link: '/cli/', activeMatch: '/cli/'  },
  { text: 'Core Module', link: '/core/', activeMatch: '/core/' },
]

// /////////////////////////
// Sibebar items
// /////////////////////////

const collapsible = true

// CLI

const install = _ => ({
  text: 'Getting Started',
  collapsible,
  items: [
    { text: 'TL;DR', link: '/cli/install/tldr'},
    { text: 'Prerequisite', link: '/cli/install/prerequisite'},
    { text: 'Install', link: '/cli/install/install'},
    { text: 'Usage', link: '/cli/install/usage'}
  ]
})

const commands = _ => [{
  text: 'Config Command',
  collapsible,
  items: [
    { text: 'config', link: '/cli/commands/config' }
  ]
}, {
  text: 'Querying Commands',
  collapsible,
  items: [
    { text: 'query', link: '/cli/commands/querying' },
  ]
}, {
  text: 'Controlling Commands',
  collapsible,
  items: [
    { text: 'compliant', link: '/cli/commands/controlling/compliant' },
    { text: 'stiff', link: '/cli/commands/controlling/stiff' },
    { text: 'speed', link: '/cli/commands/controlling/speed' },
    { text: 'goto', link: '/cli/commands/controlling/goto' },
    { text: 'rotate', link: '/cli/commands/controlling/rotate' },
    { text: 'led', link: '/cli/commands/controlling/led' }
  ]
},{
  text: 'Admin Commands',
  collapsible,
  items: [
    { text: 'logs', link: '/cli/commands/admin/logs' },
    { text: 'api', link: '/cli/commands/admin/api' },
    { text: 'reboot', link: '/cli/commands/admin/reboot' },
    { text: 'shutdown', link: '/cli/commands/admin/shutdown' }
  ]
}]

const connection = _ => ({
  text: 'Connect to Robot',
  collapsible,
  items: [
    { text: 'Via CLI Flags', link: '/cli/connection/cli' },
    { text: 'Persisting Settings', link: '/cli/connection/persisting' }
  ]
})

// CORE

const core = _ => ({
  text: 'API',
  collapsible,
  items: [
    { text: 'Wrapped Factories', link: '/core/factories' },
    { text: 'Exposed API', link: '/core/lib' }
  ]
})


// /////////////////////////
// Public API
// /////////////////////////

module.exports = {
  lang: 'en-US',
  title: 'Poppy CLI',
  description: ' Command line tool to interact with Poppy robot',
  base: '/poppy-robot-cli/',
  themeConfig: {
    logo: '/cli.png',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/nbarikipoulos/poppy-robot-cli' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2018-2022 Nicolas Barriquand'
    },
    nav: nav(),
    sidebar: {
      '/cli': [
        install(),
        ...commands(),
        connection()
      ],
      '/core' : [
        core()
      ]
    }
  }
}
