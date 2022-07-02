---
title: Rotate Command
---

# Rotate

## Overview

This command rotates the target motor(s) by x degrees from their current angle.

```shell
cli rotate <value> [-wh] [-m motors] [-H hostname] [-P port]
```

## Options

&nbsp; | desccription | value | default | mandatory
--- | --- | --- | --- | ---
\<value\> | Rotation value (in degree) |integer | n.a. | yes
-w/--wait | Wait until the end of the rotation | boolean | false | no
-m/--motor | Select the targeted motors.| name of motors \| 'all' | 'all' | no
-H/--host | Set the Poppy hostname/IP | string | poppy.local | no
-p/--port | Set the REST API port on Poppy | integer | 8080 | no
-h/--help | Display help about this command | boolean | false | no

## Examples

- Simultanoueslit rotate all motors by 10 degrees:
```shell
cli rotate 10
```

- Rotate the motor m1 by -90 degrees and wait the end of the rotation:
```shell
cli rotate -90 -m m1 -w
```
