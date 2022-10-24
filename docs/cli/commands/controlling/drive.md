---
title: Drive Command
---

# Drive

## Overview

This command allows to drive the robot using keyboard.

```shell
poppy drive [-h] [-a angle] [-s speed] [-H hostname] [-P port]
```

## Options

&nbsp; | desccription | value | default | mandatory
--- | --- | --- | --- | ---
-a/--angle | Rotation value (in degree) for rotation keys | integer | 10 | no
-s/--speed | Set the 'goal_speed' register of all motors | an integer in the [0, 1023] range | 150 | no
-H/--host | Set the Poppy hostname/IP | string | poppy.local | no
-p/--port | Set the REST API port on Poppy | integer | 8080 | no
-h/--help | Display help about this command | boolean | false | no

## Examples

```shell
poppy drive
```
