---
title: Install
---

Poppy CLI is delivered as:
- A npm package that requires node.js and could be installed whatever the os (macOS, windows or linux-like OS),
- A standalone executable that __does not require node.js__ pre-installed:
  - Delivered as a Windows installer for Windows OS,
  - To build (using node.js) for macOS and Linux.

## As a npm Package

Typing

```shell
npm i poppy-robot-cli -g
```

will globally install the poppy-robot-cli module


::: warning Node.js release

Supported releases of node.js are 14 and higher.

:::

Once installed, just type:

```shell
poppy -h
```

to display basic help.

## As a Standalone Executable

### Windows

A standalone executable that does __not require node.js__ installed at all, is available as a Windows installer [here][windows-msi].

As it automatically updates thePATH environment variable, once installed, open a new command terminal and then type:

```shell
poppy -h
```

in order to display basic help.

### Linux/MacOS/Others

User can produce their own standalone executables. 
Note node.js is mandatory to produce these executables.

Typing the command below will produce executables for linux and macOS (from and for an x64 architecture)

```shell
npx pkg . --targets linux-x64,macos-x64
```

Read [here][pkg-targets] about arm architecture, macos arm or instructions for cross platform.

[windows-msi]: https://github.com/nbarikipoulos/poppy-robot-cli/releases/latest
[pkg-targets]: https://github.com/vercel/pkg#targets