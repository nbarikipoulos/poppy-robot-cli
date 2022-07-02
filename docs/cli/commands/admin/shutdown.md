---
title: Shutdown Command
---

# Shutdown

## Overview

This command will turn the Raspberry off.

```shell
poppy shutdown [-h] [-H hostname]
```

## Options

&nbsp; | desccription | value | default | mandatory
--- | --- | --- | --- | ---
-H/--host | Set the Poppy hostname/IP | string | poppy.local | no
-h/--help | Display help about this command | boolean | false | no

## Examples

Turn the robot located at poppy1.local off:

```shell
poppy shutdown -H poppy1.local
```
