---
title: Exposed API
---

# {{ $frontmatter.title }}

Below the list of elements exposed from the [poppy-robot-core][poppy-robot-core]:

name | description | type | wrapped
--- | --- | --- | ---
createPoppy | Discover and create a new Poppy object | function | yes
createScript | Create a new Script object | function | no
createDescriptor | Discover and create a robot descriptor | function | yes
createRequestHandler | Create a request handler object | function | yes
Script | Script object | object | no
Poppy | Poppy object | object | no
ExtMotorRequest | Extended Motor Request object | object | no
RawMotorRequest | Raw Motor Request object | object | no
PoppyRequestHandler | Request handler to motors | object | no

Detailed API is available [here][poppy-robot-core-api].


[poppy-robot-core]: https://github.com/nbarikipoulos/poppy-robot-core
[poppy-robot-core-api]: https://github.com/nbarikipoulos/poppy-robot-core/blob/master/doc/api.md
