---
title: Query Command
---

# Query

## Overview

This command allows querying the registers of the motors of the robot.

```shell
poppy config [-Ith] [-r registers] [-m motors] [-H hostname] [-P port]
```

## Options

&nbsp; | desccription | value | default | mandatory
--- | --- | --- | --- | ---
\<value\> | Target angle to reach (in degree) |integer | n.a. | yes
-I/--invert | Invert table presentation | boolean | false | no
-t/--tree |  Display querying result as a tree | boolean | false | no
-r/--register | Select registers to query.| name of register(*) | (**) | no
-m/--motor | Select the targeted motors.| name of motors \| 'all' | 'all' | no
-H/--host | Set the Poppy hostname/IP | string | poppy.local | no
-p/--port | Set the REST API port on Poppy | integer | 8080 | no
-h/--help | Display help about this command | boolean | false | no

(*) To selected in the list below.
(**) Registers selected by default are: 'compliant', 'lower_limit', 'present_position', 'goal_position', 'upper_limit', 'moving_speed' and 'present_temperature'.


## Examples

- Typing

```shell
poppy query
```

Will return data about all 'default' for all motors.

```
┌─────────────────────┬───────┬────────┬───────┬───────┬───────┬───────┐
│                     │ m1    │ m2     │ m3    │ m4    │ m5    │ m6    │
├─────────────────────┼───────┼────────┼───────┼───────┼───────┼───────┤
│ compliant           │ true  │ true   │ true  │ true  │ true  │ true  │
├─────────────────────┼───────┼────────┼───────┼───────┼───────┼───────┤
│ lower_limit         │ -89.9 │ 89.9   │ 89.9  │ -89.9 │ 89.9  │ 89.9  │
├─────────────────────┼───────┼────────┼───────┼───────┼───────┼───────┤
│ present_position    │ -0.1  │ -89    │ 86.4  │ -1.3  │ -94.3 │ 1.0   │
├─────────────────────┼───────┼────────┼───────┼───────┼───────┼───────┤
│ goal_position       │ 0     │ -90    │ 90    │ 0     │ -90   │ 0     │
├─────────────────────┼───────┼────────┼───────┼───────┼───────┼───────┤
│ upper_limit         │ 89.9  │ -125.1 │ -89.9 │ 89.9  │ -89.9 │ -89.9 │
├─────────────────────┼───────┼────────┼───────┼───────┼───────┼───────┤
│ moving_speed        │ 100   │ 100    │ 100   │ 100   │ 100   │ 100   │
├─────────────────────┼───────┼────────┼───────┼───────┼───────┼───────┤
│ present_temperature │ 35    │ 35     │ 35    │ 34    │ 33    │ 34    │
└─────────────────────┴───────┴────────┴───────┴───────┴───────┴───────┘
```

- Typing:

```shell
poppy query -m m2 m3 m4 m5 -r present_position goal_position -I
```

Will display the values for registers 'present_position' and 'goal_position' of the motors m2 to m5:

```shell
poppy query -m m2 m3 m4 m5 -r present_position goal_position -I
┌────┬──────────────────┬───────────────┐
│    │ present_position │ goal_position │
├────┼──────────────────┼───────────────┤
│ m2 │ -89              │ -90           │
├────┼──────────────────┼───────────────┤
│ m3 │ 86.4             │ 90            │
├────┼──────────────────┼───────────────┤
│ m4 │ -1.3             │ 0             │
├────┼──────────────────┼───────────────┤
│ m5 │ -94.9            │ -90           │
└────┴──────────────────┴───────────────┘
```

- Typing:

```shell
poppy query -r compliant -t
```

Will display the values for the register 'compliant' as a tree in accordance with the 'structure' of the robot:

```shell
Poppy
 ├─ base
 │  ├─ m1: true
 │  ├─ m2: true
 │  └─ m3: true
 └─ tip
    ├─ m4: false
    ├─ m5: false
    └─ m6: false
```
