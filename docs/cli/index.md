---
title: What is Poppy CLI?
---

# {{ $frontmatter.title }}

Poppy CLI is a tool dedicated to simply monitor and interact with robots of the [Poppy project](https://www.poppy-project.org/en/) family in command line.

Poppy CLI is provided as:
- A __npm module__,
- a __standalone executable__ that does not require node.js/npm pre-installed as prerequisite.

It allows:
- To monitor the motors reading values of motor registers,
  
  As example, typing :
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
- To interact with robots sending to motors some set of instructions to the registers and then, to allow performing unary 'action' such as move, speed settings, and so on... simply typing in a command line terminal.

  As example, typing :

  ```shell
  poppy stiff
  poppy speed 120
  poppy rotate -90 -m m1
  poppy goto 0 -m m2 m3 m4 m5 m6 -d 2
  ```

  Will:
  - Switch all motors to stiff state,
  - Set up their speed to 120,
  - Rotate by -90 degrees the motor m1,
  - At last, move the other motors to position 0 in 2s.

