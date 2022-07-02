---
title: Config Command
---

# Config

## Overview

This command allows to:
- Check the connection settings to the robots,
- Display the robot structure (_i.e._ aliases and motors) and then perform a connection test to all motors.

```shell
poppy config [-MDsh] [-H hostname] [-P port]
```

## Options

&nbsp; | desccription | value | default | mandatory
--- | --- | --- | --- | ---
-M/--structure | Display the robot structure (aliases and motors) and check connection to each motors | boolean | false | no
-D/--details | Display details about motors | boolean | false | no
-s/--save | Save connection settings in .poppyrc file | boolean | false | no
-H/--host | Set the Poppy hostname/IP | string | poppy.local | no
-p/--port | Set the REST API port on Poppy | integer | 8080 | no
-h/--help | Display help about this command | boolean | false | no

## Examples

- Typing

```shell
poppy config -M
```

Will discover the robot and display an aliases/motors tree as shown on the screenshot below:

```
>> Connection to Poppy (hostname/ip: poppy.local)
  REST API (port 8080):  OK
>> Structure:
  Poppy
   ├─ base
   │  ├─ m1
   │  ├─ m2
   │  └─ m3
   └─ tip
      ├─ m4
      ├─ m5
      └─ m6
```

- Typing

```shell
poppy config -MD
```

Will display information about motors.

```
>> Connection to Poppy (hostname/ip: poppy.local)
  REST API (port 8080):  OK
>> Structure: 
  Poppy
   ├─ base
   │  ├─ m1
   │  │  ├─ id: 1
   │  │  ├─ type: XL-320
   │  │  └─ angle: [-90,90]
   │  ├─ m2
   │  │  ├─ id: 2
   │  │  ├─ type: XL-320
   │  │  └─ angle: [90,-125]
   │  └─ m3
   │     ├─ id: 3
   │     ├─ type: XL-320
   │     └─ angle: [90,-90]
   └─ tip
      ├─ m4
      │  ├─ id: 4
      │  ├─ type: XL-320
      │  └─ angle: [-90,90]
      ├─ m5
      │  ├─ id: 5
      │  ├─ type: XL-320
      │  └─ angle: [90,-90]
      └─ m6
         ├─ id: 6
         ├─ type: XL-320
         └─ angle: [90,-90]
```

- Typing

```shell
poppy config -s -H poppy1.local -p 8081
```

Will check robot located at 'poppy1.local' and with REST API configured on port 8081 and save, in case of success, these connection settings in file named .poppyrc.