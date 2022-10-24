---
title: Rotate Command
---

# Rotate

## Overview

This command rotates the target motor(s) by x degrees from their current angle.

```shell
poppy rotate <value> [-wh] [-d duration] [-m motors] [-H hostname] [-P port]
```

## Options

&nbsp; | desccription | value | default | mandatory
--- | --- | --- | --- | ---
\<value\> | Rotation value (in degree) |integer | n.a. | yes
-d/--duration | Set duration of the movement | number | n.a. | no
-w/--wait | Wait until the end of the rotation | boolean | false | no
-m/--motor | Select the targeted motors.| name of motors \| 'all' | 'all' | no
-H/--host | Set the Poppy hostname/IP | string | poppy.local | no
-p/--port | Set the REST API port on Poppy | integer | 8080 | no
-h/--help | Display help about this command | boolean | false | no

## Examples

- Simultaneously rotate all motors by 10 degrees:
```shell
poppy rotate 10
```

- Rotate the motor m1 by -90 degrees in 2.5 seconds:
```shell
poppy rotate -90 -m m1 -d 2.5
```
