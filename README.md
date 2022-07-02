# Poppy Robot CLI

[![NPM version][npm-image]][npm-url]
[![JavaScript Style Guide][standard-image]][standard-url]
[![Language grade: JavaScript][lgtm-image]][lgtm-url]
[![Maintainability][code-climate-image]][code-climate-url]

This project allows to simply monitor and interact with robots of the [Poppy project](https://www.poppy-project.org/en/) family in command line.

It provides a simple tool (provided as a npm module or a standalone executable) to query and send basic set of instructions to the registers of motors and then, to allow performing unary 'action' such as move, speed settings, and so on... simply typing in a command line terminal.

As example, typing :

```shell
poppy stiff
poppy speed 120
poppy rotate -90 -m m1
poppy position 0 -m m2 m3 m4 m5 m6
```

Will:
- Switch all motors to stiff state,
- Set up their speed to 120,
- Rotate by -90 degrees the motor m1,
- At last, move the other motors to position 0.
    
Typing:

```shell
poppy query
```

Will display in a table the value of the registers for all motors.

```shell
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

## Documentation

A full documentation about both intallation and usage is available [here][docs]. 

## Advanced Uses

This module faces the objects and the factories of the [poppy-robot-core][core-link] as well as it introduces new features to ease connection settings.

Check the dedicated [documentation][docs-core] for detailed instructions.

## Known Limitations

- __This module has been only tested with the Poppy Ergo Jr__ (aka with a set of dynamixel XL-320). As it communicates with the robot via the REST API of the pypot library, it should be usable with any robot of the poppy family.


## Credits

- Nicolas Barriquand ([nbarikipoulos](https://github.com/nbarikipoulos))

## License

The poppy-robot-cli is MIT licensed. See [LICENSE](./LICENSE.md).

[docs]: https://nbarikipoulos.github.io/poppy-robot-cli
[docs-core]: https://nbarikipoulos.github.io/poppy-robot-cli/core

[core-link]: https://github.com/nbarikipoulos/poppy-robot-core#readme

[npm-url]: https://www.npmjs.com/package/poppy-robot-cli
[npm-image]: https://img.shields.io/npm/v/poppy-robot-cli.svg
[standard-url]: https://standardjs.com
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg

[lgtm-url]: https://lgtm.com/projects/g/nbarikipoulos/poppy-robot-cli
[lgtm-image]: https://img.shields.io/lgtm/grade/javascript/g/nbarikipoulos/poppy-robot-cli.svg?logo=lgtm&logoWidth=18
[code-climate-url]: https://codeclimate.com/github/nbarikipoulos/poppy-robot-cli/maintainability
[code-climate-image]: https://api.codeclimate.com/v1/badges/1e23c37d39d4bcf8d6ce/maintainability