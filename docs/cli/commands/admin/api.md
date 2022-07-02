---
title: Robot API Command
---

# Api

## Overview

This command allows to start/reset/stop the robot API.

```shell
poppy api [action] [-h] [-H hostname]
```

## Options

&nbsp; | desccription | value | default | mandatory
--- | --- | --- | --- | ---
\[action\] | Start/Reset/Stop the robot api| start \| reset \| stop | reset | no
-H/--host | Set the Poppy hostname/IP | string | poppy.local | no
-h/--help | Display help about this command | boolean | false | no

## Examples

  - Reset the robot api:
  ```shell
  poppy api
  ```

  - Stop the robot api:
  ```shell
  poppy api stop
  ```
