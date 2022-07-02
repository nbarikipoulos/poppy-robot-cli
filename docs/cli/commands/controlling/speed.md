---
title: Speed Command
---

# Speed

## Overview

This command sets the the rotation speed of the selected motor(s).

```shell
poppy speed <value> [-h] [-m motors] [-H hostname] [-P port]
```

## Options

&nbsp; | desccription | value | default | mandatory
--- | --- | --- | --- | ---
\<value\> | Set the 'goal_speed' register | an integer in the [0, 1023] range | n.a. | yes
-m/--motor | Select the targeted motors.| name of motors \| 'all' | 'all' | no
-H/--host | Set the Poppy hostname/IP | string | poppy.local | no
-p/--port | Set the REST API port on Poppy | integer | 8080 | no
-h/--help | Display help about this command | boolean | false | no

## Examples

- Set the rotation speed of all motors to 100 (slower):
```shell
poppy speed 80
```

- Set the rotation speed of the motors m1 and m2 to 200 (quicker):
```shell
poppy speed 200 -m m1 m2
```
