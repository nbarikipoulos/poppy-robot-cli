---
title: Reboot Command
---

# Reboot

## Overview

This command will reboot the Raspberry.

```shell
poppy reboot [-h] [-H hostname]
```

## Options

&nbsp; | desccription | value | default | mandatory
--- | --- | --- | --- | ---
-H/--host | Set the Poppy hostname/IP | string | poppy.local | no
-h/--help | Display help about this command | boolean | false | no

## Examples

Reboot the robot located at poppy1.local:

```shell
poppy reboot -H poppy1.local
```
