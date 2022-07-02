---
title: Persisting Settings
---

User can persist its connection settings in a rc-like file.

Create a json file named '.poppyrc' that respect the 'format' below
```
{
  'host': 'poppy1.local'
  'port': 8081
}
```

Note the poppy cli will:
- First check if a .poppyrc file exists, and then extract settings,
- On a second hand, use the CLI settings, if any, and then it will override the corresponding values.

In order to generate this file, user can call the config command with the --save flag:

```shell
poppy config --host poppy1.local -p 8081 --save
```

::: info
Note this command will save configuration only if the connection to the robot is successful.
:::