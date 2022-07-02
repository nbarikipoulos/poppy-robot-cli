---
title: Usage
---

## Checking Targeted Robot

Next the Poppy robot turns on and is ready (green light blinking), the following command could be performed first in order to ensure the robot is available:

```shell
poppy config -M
```

It looks up to a robot located at 'poppy.local', dicovers it and display its structure.

Note connection parameters (aka hostname and REST API port) could be easily changed and persisted (respectively see [here](/cli/connection/cli) and [there](/cli/connection/persisting)).

```shell
poppy config -M --host poppy1.local
```

## Commands

Typing:
```shell
poppy -h
```
will display global help and list all the available commands.

Details about a command could be displayed typing:
```shell
poppy <command> -h
```


