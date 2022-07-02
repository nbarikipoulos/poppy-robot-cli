---
title: Connection Settings
---

By default, connection values are set to poppy ergo jr default ones aka the host and rest API port are respectively set to poppy.local and 8080.

These connection settings could be changed via the flags listed below:

option | desc | value | default
--- | --- | --- | --- |
-H/--host | Set the Poppy hostname/IP | string | poppy.local
-p/--port | Set the REST API port on Poppy | integer | 8080

As example,

```shell
poppy config -MD --host 'poppy1.local' -p 8081
```

Will discover the configuration of robot with hostname and rest API port respectively set to 'poppy1.local' and 8081.

To avoid typing the connection settings values every time, users can persist them in a rc like file through the 'config' command of the CLI as 
explained in dedicated [part](/cli/connection/persisting).