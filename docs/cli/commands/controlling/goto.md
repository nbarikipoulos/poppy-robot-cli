---
title: Goto Command
---

# Goto

## Overview

This command sets the target position/angle of the selected motor(s).

```shell
poppy goto <value> [-wh] [-d duration] [-m motors] [-H hostname] [-P port]
```

## Options

&nbsp; | desccription | value | default | mandatory
--- | --- | --- | --- | ---
\<value\> | Target angle to reach (in degree) |integer | n.a. | yes
-d/--duration | Set duration of the movement | number | n.a. | no
-w/--wait | Wait until motor(s) reachs new position  | boolean | false | no
-m/--motor | Select the targeted motors.| name of motors \| 'all' | 'all' | no
-H/--host | Set the Poppy hostname/IP | string | poppy.local | no
-p/--port | Set the REST API port on Poppy | integer | 8080 | no
-h/--help | Display help about this command | boolean | false | no

## Examples

- Move all motors to the angle 0 degree:
```shell
poppy goto 0
```

- Move the motors m1 and m2 to the angle 90 degrees in 3 seconds:
```shell
poppy goto 90 -m m1 m2 -d 3
```
