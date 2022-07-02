---
title: Led Command
---

# Led

## Overview

This command sets the led color of the selected motor(s).

```shell
poppy led [value] [-h] [-m motors] [-H hostname] [-P port]
```

## Options

&nbsp; | desccription | value | default | mandatory
--- | --- | --- | --- | ---
[value] | Set the 'led' register| off \| red \| green \| blue \| yellow \| cyan \| pink \| white | off | no
-m/--motor | Select the targeted motors.| name of motors \| 'all' | 'all' | no
-H/--host | Set the Poppy hostname/IP | string | poppy.local | no
-p/--port | Set the REST API port on Poppy | integer | 8080 | no
-h/--help | Display help about this command | boolean | false | no

## Examples

- Turn all leds off:
```shell
poppy led
```

- Set the led color of motors 'm3', 'm4' and 'm5' to 'green':
```shell
poppy led green -m m3 m4 m5
```
