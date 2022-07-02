---
title: Wrapped Factories
---

# {{ $frontmatter.title }}

In order to ease connection settings, the poppy-robot-cli wraps the utility factories dedicated to connect with the Robot of from the [poppy-robot-core][poppy-robot-core] module.

Once used instead of the legacy factories, users can use both the connection settings flags introduced in the poppy CLI as well as the .poppyrc file to persist their settings.

As example the following script named myScript.js
```js{1,10-13,15}
const { createPoppy, createScript } = require('poppy-robot-core')

const script = createScript()
  .select('all')
  .stiff()
  .goto(0, true)
  .select('m1','m2')
  .rotate(90)

const config = {
  host: 'myPoppy.local',
  port: 8081
}

createPoppy(config).then(poppy => {
 poppy.exec(script)
})
```

Could be modified is this way:

```js{1,10}
const { createPoppy, createScript } = require('poppy-robot-cli')

const script = createScript()
  .select('all')
  .stiff()
  .goto(0, true)
  .select('m1','m2')
  .rotate(90)

createPoppy().then(poppy => {
 poppy.exec(script)
})
```

And then, settings options could be moved from code to:
- The cli:

```shell
node myScript --host 'myPoppy.local' -p 8081
```
- Or to a configuration file named '.poppyrc':
```json
{
  'host': 'myPoppy.local',
  'port': 8081
}
```

Note these wrapped factories will:
- First check if a .poppyrc file exists, and then extract settings,
- On a second hand, use the CLI settings, if any, that will override previous settings,
- At last, overriding the previously obtained settings with users's argument to these factories.


[poppy-robot-core]: https://github.com/nbarikipoulos/poppy-robot-core

