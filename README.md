# Poppy Robot CLI

[![NPM version][npm-image]][npm-url]
[![JavaScript Style Guide][standard-image]][standard-url]
[![Language grade: JavaScript][lgtm-image]][lgtm-url]
[![Maintainability][code-climate-image]][code-climate-url]

This module allows to simply interact with robots of the [Poppy project](https://www.poppy-project.org/en/) family in command line.

It provides:

- A [CLI mode](#cli-mode) to query and send basic set of instructions to the registers of mortors and then, to allow performing unary 'action' on motors such as move, speed settings, and so on... simply typing in a command line terminal.

    As example:

    ```shell
    poppy rotate 30 -m m1 m2
    ```

    will rotate by 30 degrees the motors m1 and m2.

    Typing:

    ```shell
    poppy query
    ```

    will return data about all registers 'of interest' for all motors.

    ```shell
    $poppy query
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

- A "wrapper" of the exposed [poppy-robot-core](https://github.com/nbarikipoulos/poppy-robot-core) factories in order to both manage a set of common flags dedicated to the connections with Poppy.

    As example:

    ```shell
    poppy rotate 30 -m m1 m2 --host 'poppy1.local' -p 8081
    ```

    will address this rotate command to a Poppy with hostname/ip and port of its REST api set to respectively
    'poppy1.local' and 8081. Note these additionnal flags can be used with poppy script (cf. [script](https://github.com/nbarikipoulos/poppy-robot-core#scripts) in [poppy-robot-core](https://github.com/nbarikipoulos/poppy-robot-core) module):

    ```shell
    node myScript.js --host 'poppy1.local' -p 8081
    ```

- Next to these common flags, a poppy rc file feature that allows persisting of these connection parameters into a dedicated file.

Enjoy, ;)

## Table of Contents

<!-- toc -->

- [TL;DR](#tldr)
- [Prerequisite](#prerequisite)
- [Getting Started](#getting-started)
  * [Using node.js/npm](#using-nodejsnpm)
    + [Installing node.js](#installing-nodejs)
    + [Installing the poppy-robot-cli module](#installing-the-poppy-robot-cli-module)
  * [Standalone Executable](#standalone-executable)
    + [Windows](#windows)
    + [Linux/MacOS](#linuxmacos)
- [Usage](#usage)
- [CLI Mode](#cli-mode)
  * [Checking and Displaying Robot Configuration](#checking-and-displaying-robot-configuration)
  * [Querying](#querying)
  * [Executing Single Command](#executing-single-command)
    + [compliant](#compliant)
    + [stiff](#stiff)
    + [speed](#speed)
    + [rotate](#rotate)
    + [position](#position)
    + [led](#led)
  * [Admin Commands](#admin-commands)
    + [Getting Logs](#getting-logs)
    + [Start/Reset/Stop Robot API](#startresetstop-robot-api)
    + [Rebooting the Raspberry](#rebooting-the-raspberry)
    + [Shutdown the Raspberry](#shutdown-the-raspberry)
- [Connection Settings](#connection-settings)
  * [Common CLI Flags](#common-cli-flags)
  * [Poppy "Runtime Configuration" File](#poppy-runtime-configuration-file)
- [API](#api)
- [Known Limitations](#known-limitations)
- [Credits](#credits)
- [License](#license)

<!-- tocstop -->

## TL;DR

Intall it:
  - As a standalone executable:
    - Available on this [page](https://github.com/nbarikipoulos/poppy-robot-cli/releases/latest) for Windows,
    - Or, in the end, read [here](#linuxmacos) for MacOS/Linux,
  - As a npm package:
    ```shell
    npm install poppy-robot-cli -g
    ```

Once installed, just type:

```shell
poppy -h
```

To access to the help about available commands.

## Prerequisite

__This module requires Poppy software ^v3.0.0__ installed on robot.

## Getting Started

This tool is delivered as:
- A npm module that requires node.js and could be installed whatever the os (macOS, windows or linux-like OS),
- A standalone executable that does not require node.js pre-installed:
  - Delivered as a Windows installer for Windows OS,
  - To build (using node.js) for macOS and Linux.

### Using node.js/npm

#### Installing node.js

the poppy-robot-cli is intented to be used under a node.js 'environment' on your local computer. Thus it should be first installed (sic):

- Downloading it from its [official site](https://nodejs.org/en/download/),
- Or using a node version manager such as nvm (macos/linux version or Windows one are respectively available [here](https://github.com/creationix/nvm) and [there](https://github.com/coreybutler/nvm-windows)).

Note a node.js release equal or higher to v12.0.0 is required.

#### Installing the poppy-robot-cli module

Once [node.js](https://nodejs.org/en/download/) installed, type:

```shell
npm i poppy-robot-cli --global
```

that will globally install the poppy-robot-cli module.

To verify that it has been successfully installed, type:

```shell
npm list -g --depth=0
├── npm@6.13.4
└── poppy-robot-cli@8.0.0
```

Then, simply type:

```shell
poppy -h
```

will display the basic help about the poppy-robot-cli.

### Standalone Executable

#### Windows

A standalone executable which does __not require node.js__ intalled at all, is available as a Windows installer [here](https://github.com/nbarikipoulos/poppy-robot-cli/releases/latest).

As it automatically updates PATH environment variable, once installed, open a new command terminal and then type:

```shell
poppy -h
```

#### Linux/MacOS

User can produce standalone executables of this module. 
Note node.js is mandatory to produce these executables but it will not to launch them.

Typing the command below will produce executables named nodeX-linux-x64 and nodeX-macos-x64.

```shell
npx pkg .
```

Note it could be performed whatever your OS.

## Usage

Once installed, both CLI mode and scripting mode are addressable without any other settings.

Next the Poppy robot turns on and is ready (green light blinking), the following command could be performed first in order to ensure the robot is available:

```shell
poppy config -M
```

It will simply look up to a robot located at poppy.local and display its structure.

Note connection parameters (hostname/rest api port) could be easily changed (see details [section](#configuring-poppy)).

```shell
poppy config -M --host poppy1.local
```
Typing:
```shell
poppy -h
```
will display global help and list available commands.

## CLI Mode

The cli commands are divided into 4 parts:

- A config module to check and display robot configuration,
- A querying module to get information about the motors,
- A command module which allows sending simple commands to the motors,
- At last, a set of admin-level commands.

### Checking and Displaying Robot Configuration

First group of cli commands named 'config' allows:
- Checking the connection settings,
- Displaying the robot structure (_i.e._ aliases and motors) and then perform a connection test to all motors,

Typing

```shell
poppy config -M
```

will discover the robot here located with the default values for hostname and http port _i.e._ poppy.local and 8080 and display an aliases/motors tree as shown on the screenshot below:

```
$poppy config -M
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
Adding -d flag will display details about motors:
```
$poppy config -Md
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

### Querying

This group of cli commands allows querying the registers of the motors of the robot.

Typing:

```shell
poppy query
```

will return data about all registers 'of interest' for all motors.

```shell
$poppy query
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
Adding the flag -h will display help for optional options:

- -m to select the motor(s) to query,
- -r to select the register(s) to query,
- -I to invert the output table form register/motor to motor/register,
- -t to display results as a tree _i.e._ to group them per alias/motor.

As example the command below will only display the register values for 'present_position' and 'goal_position' of the motors m2 to m5:

```shell
$poppy query -m m2 m3 m4 m5 -r present_position goal_position -I
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

Another example displaying results in accordance with the 'structure' of the robot:

```shell
$poppy query -r compliant -t
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



### Executing Single Command

Next group of cli commands allows executing a single command to targeted motors. It groups a bunch of commands whose helps are accessible through this command:

```shell
poppy <command> -h
```

where the &lt;command&gt; are listed in the table below:

name | description
--- | ---
[compliant](#compliant) | Set the state of motor(s) to 'compliant' _i.e._ make them handly drivable
[stiff](#compliant) | Set the state of motor(s) to 'stiff' _i.e._ make them programmatically drivable
[speed](#speed) | Set the speed of target motor(s)
[rotate](#rotate) | Rotate the selected motor(s) by x degrees
[position](#position) | Move the selected motor(s) to a given position.
[led](#led) | Set the led color of selected motor(s)

Note **all these commands have a common optional flag '-m' in order to select the target motors**.
**If not set, a command will be applied to all motors** ('m1' to 'm6 for the Poppy Ergo Jr.)

As examples:

```shell
poppy led green
```

will set the led color to green of all motors.

```shell
poppy led blue -m m1 m2
````

will set the led color of motor m1 and m2 to blue.

Next paragraphs will detail all the available execution commands and their specific options.

#### compliant

```shell
poppy compliant
```

This command sets the state of the selected motor(s) to 'compliant' _i.e._ make them handly drivable.

Examples:

- Set state of all motors to 'compliant':

    ```shell
    poppy compliant
    ```
- Set state of motors m1 and m2 to 'compliant':

    ```shell
    poppy compliant -m m1 m2
    ```

#### stiff

```shell
poppy stiff
```

This command sets the state of the selected motor(s) to 'stiff' _i.e._ make them programmatically drivable.

Examples:

- Set state of all motors to 'stiff':

    ```shell
    poppy stiff
    ```
- Set state of motors m1 and m2 to 'stiff':

    ```shell
    poppy stiff -m m1 m2
    ```

#### speed

```shell
poppy speed <value>
```

This command sets the the rotation speed of the selected motor(s).

&nbsp; | desc | value | default | mandatory
--- | --- | --- | --- | ---
value | set the 'goal_speed' register | an integer in the [0, 1023] range | n.a. | yes

Examples:

- Set the rotation speed of all motors to 100 (slower):

    ```shell
    poppy speed 100
    ```

- Set the rotation speed of the motors m1 and m2 to 500 (quicker):

    ```shell
    poppy speed 500 -m m1 m2
    ```

#### rotate

```shell
poppy rotate <value> [-w]
```

This command rotates the target motor(s) by x degrees from the current position.

&nbsp; | desc | value | default | mandatory
--- | --- | --- | --- | ---
value | the rotation value (in degree) | integer | n.a. | yes

option | desc | value | default | mandatory
--- | --- | --- | --- | ---
-w | wait until the rotation will finish | boolean | false | no

Examples:

- Rotate the motors m1 and m2 by -30 degrees and wait until each motors will reach its new position:

    ```shell
    cli rotate -30 -m m1 m2 -w
    ```

#### position

```shell
cli positon <value> [-w]
```

This command sets the target position of the selected motor(s) _i.e._ it will move motor(s) to a given position.

&nbsp; | desc | value | default | mandatory
--- | --- | --- | --- | ---
value | the target position to reach (in degree)| integer | n.a. | yes

option | desc | value | default | mandatory
--- | --- | --- | --- | ---
-w | wait until the motor(s) will reach this new positions  | boolean | false | no

Examples:

- Simultaneously move all motors to the position 0 degree:

    ```shell
    poppy position 0
    ```

- Sequentially move all motors to the position 0 degree:

    ```shell
    poppy position 0 -w
    ```

- Sequentially move the motors m1 and m2 to the 0 degree position:

    ```shell
    poppy position 90 -m m1 m2 -w
    ```

#### led

```shell
poppy led [value]
```

This command sets the led color of the selected motor(s).

&nbsp; | desc | value | default | mandatory
--- | --- | --- | --- | ---
value | set the 'led' register| off \| red \| green \| blue \| yellow \| cyan \| pink \| white | off | no

Examples:

- Turn off the led of all motors:

    ```shell
    poppy led
    ```

- Set the led color of motor 'm3' to 'green':

    ```shell
    poppy led green -m m3
    ```

### Admin Commands

The next set of commands allows performing some "admin" level actions

#### Getting Logs

```shell
poppy logs
```

This command will display logs of the robots to the console.

#### Start/Reset/Stop Robot API

```shell
poppy api [action]
```

This command allows starting/reseting/Stopping the robot API

&nbsp; | desc | value | default | mandatory
--- | --- | --- | --- | ---
value | start/reset/stop the robot api| start \| reset \| stop | reset | no

Examples:
  - Reset the robot api:
    ```shell
    poppy api
    ```

  - Stop the robot api:
    ```shell
    poppy api stop
    ```
#### Rebooting the Raspberry

 ```shell
    poppy reboot
```

This command will reboot the Raspberry.

#### Shutdown the Raspberry

 ```shell
    poppy shutdown
```

This command will turn the Raspberry off.


## Connection Settings

### Common CLI Flags

In order to configure the connection to the Poppy robot, the poppy-robot-cli automatically appends a bunch of optional flags which are available for both CLI mode or script execution
(_cf._ [Scripting poppy][core-link-script] in [poppy-robot-core][core-link] module):

option | desc | value | default
--- | --- | --- | --- |
-H/--host | Set the Poppy hostname/ip | string | poppy.local
-p/--port | Set the http server port on Poppy | integer | 8080

For the CLI mode, such options are available as other ones and typing -h will display them in help.

As example,

```shell
cli rotate 30 -m m1 m2 --host 'poppy1.local' -p 8081
```

will send this rotate by 30 degrees order to a Poppy with an hostname/ip and rest api port respectively set to 'poppy1.local' and 8081.

For script exectution , simply typing -h will display help about these options and simply adding these flags at execution time will configure the Poppy context.

As example,

```shell
node myScript.js --host poppy1.local -p 8081
```

will execute myScript looking for a Poppy with 'poppy1.local' as hostname and with an http server configured on port 8081.

### Poppy "Runtime Configuration" File

To avoid typing the connection settings values every time, users can persist them in a rc like file through the 'config' command of the CLI.
Typing:

```shell
poppy config --host poppy1.local -p 8081 --save
```

will create a local .poppyrc file which handles these settings. __This file will be used for each call of the poppy-robot-cli__ (in both CLI or script execution mode) __executed from this directory__.

Note the poppy-robot-cli will:

- First checks if a .poppyrc file exists, and then it will extract its settings,
- On a second hand, use the CLI settings, if any, and then it will override the corresponding values,
- At last, it will override these settings with values passed through the
command line.

## API

This module re-exports the [poppy-robot-core][core-link] module elements. See this module [api][core-link-api] for further details.

## Known Limitations

- __This module has been only tested with the Poppy Ergo Jr__ (aka with a set of dynamixel XL-320). As it communicates with the robot via the REST API of the pypot library, it should be usable with any robot of the poppy family.


## Credits

- Nicolas Barriquand ([nbarikipoulos](https://github.com/nbarikipoulos))

## License

The poppy-robot-cli is MIT licensed. See [LICENSE](./LICENSE.md).

[core-link]: https://github.com/nbarikipoulos/poppy-robot-core#readme
[core-link-api]: https://github.com/nbarikipoulos/poppy-robot-core/blob/master/doc/api.md
[core-link-script]: https://github.com/nbarikipoulos/poppy-robot-core#writing-scripts

[npm-url]: https://www.npmjs.com/package/poppy-robot-cli
[npm-image]: https://img.shields.io/npm/v/poppy-robot-cli.svg
[standard-url]: https://standardjs.com
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg

[lgtm-url]: https://lgtm.com/projects/g/nbarikipoulos/poppy-robot-cli
[lgtm-image]: https://img.shields.io/lgtm/grade/javascript/g/nbarikipoulos/poppy-robot-cli.svg?logo=lgtm&logoWidth=18
[code-climate-url]: https://codeclimate.com/github/nbarikipoulos/poppy-robot-cli/maintainability
[code-climate-image]: https://api.codeclimate.com/v1/badges/1e23c37d39d4bcf8d6ce/maintainability