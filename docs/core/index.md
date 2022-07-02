---
title: Core Module
---

This part is dedicated to script writers.

This module:
- Firstly exposes the [poppy-robot-core][poppy-robot-core] API,
- On a second hand, it aims to ease connection settings appending:
    - The connection flags --host/--port introduced with the poppy CLI,
    - The persisting of these settings into a file.

To this end, it wraps the utility factories (aka functions prefixed by create) in order to manage these new features.

At the end, it allows to launch scripts moving users' connection settings to the cli:

```shell
node myScript.js --host 'poppy1.local' -p 8081
``` 

[poppy-robot-core]: https://github.com/nbarikipoulos/poppy-robot-core
