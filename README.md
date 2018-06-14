<img src="_media/ow-logo.png" width="100" />

# @ow-framework/*

**ow** [pronounced: oouhh] is a node.js framework which enforces certain patterns and restrictions in order to provide you with a stable, testable and modular application architecture.

It's aim is to provide you with a small set of core functions and a diverse set of **ow modules** which can be added and replaced depending on the needs of your application.

The way you write modules for **ow** is also straightforward and kept as simple as possible.

If you adhere to **ow**s patterns, you'll end up with applications that are modular, stable and easy to test as well as custom modules which can easily be extracted and reused in different applications.

# Features

- easy to start with – just 3 lines and you have an **ow** app running!
- small api surface (`.addModules(Module[])`, `.start()`, `.stop()`)
- easy module and env dependency declaration for modules (`envDependencies: string[]`, `dependencies: string[]`);
- ensures sequential module initialization and startup
- extend shared `app` instance with custom functionality

# Quick Start

First, install  **@ow-framework/core** in your application.
You may use either yarn or npm for this step.

```bash
yarn add @ow-framework/core
```

## Usage

Creating and starting a new app is as simple as writing 3 lines (or 1, if you dare to do so) of code.

```js
import Ow from '@ow-framework/core';

const app = new Ow();

app.start();
```

```bash
yarn start
```

## Available official modules

- [@ow-framework/core](packages/ow-core/README.md) - the core ow module
- [@ow-framework/hello-world](packages/ow-hello-world/README.md) - a simple hello world logging module

## About

Created with passion by the folks at [ovos](https://ovos.at) and
other awesome thinkers.

[@flipace](https://github.com/flipace),
[@unhawkable](https://github.com/unhawkable), [@denisloncaric](https://github.com/denisloncaric), [@saschagalley](https://github.com/saschagalley)

## License

MIT