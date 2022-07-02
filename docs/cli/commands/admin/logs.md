---
title: Logs Command
---

# Logs

## Overview

This command will display logs of the robot to the console.

```shell
poppy logs [-h] [-H hostname]
```

## Options

&nbsp; | desccription | value | default | mandatory
--- | --- | --- | --- | ---
-H/--host | Set the Poppy hostname/IP | string | poppy.local | no
-h/--help | Display help about this command | boolean | false | no

## Examples

Get logs of the robot located at poppy1.local

```shell
poppy logs -H poppy1.local
```
