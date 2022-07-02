---
title: Stiff Command
---

# Stiff

## Overview

This command sets the state of the selected motor(s) to 'stiff' _i.e._ make them programmatically drivable.

```shell
poppy stiff [-h] [-m motors] [-H hostname] [-P port]
```

## Options

&nbsp; | desccription | value | default | mandatory
--- | --- | --- | --- | ---
-m/--motor | Select the targeted motors.| name of motors \| 'all' | 'all' | no
-H/--host | Set the Poppy hostname/IP | string | poppy.local | no
-p/--port | Set the REST API port on Poppy | integer | 8080 | no
-h/--help | Display help about this command | boolean | false | no

## Examples

- Set state of all motors to 'stiff':
```shell
poppy stiff
```
- Set state of motors m1 and m2 to 'stiff':
```shell
poppy stiff -m m1 m2
```