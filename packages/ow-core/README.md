<img src="_media/ow-logo.png" width="100" />

# @ow-framework/core

**ow** [pronounced: oouhh] is a node.js framework which enforces certain patterns and restrictions in order to provide you with a stable, testable and modular application architecture.

It's aim is to provide you with a small set of core functions and a diverse set of **ow modules** which can be added and replaced depending on the needs of your application.

The way you write modules for **ow** is also straightforward and kept as simple as possible.

If you adhere to **ow**s patterns, you'll end up with applications that are modular, stable and easy to test as well as custom modules which can easily be extracted and reused in different applications.

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

Okay, that won't do much yet - except logging that your app started - but read on to see how **ow**s module system works.

## Adding your first module

To try out **ow**s module system, you may add the ```@ow-framework/hello-world``` module. It's small, simple and
easy to use. So go ahead and follow these steps:

```bash
yarn add @ow-framework/hello-world
```

```js
import Ow from '@ow-framework/core';
import HelloWorld from '@ow-framework/hello-world';

const app = new Ow();

app.addModules([
  HelloWorld
]);

app.start();
```

```bash
yarn start
```

If you're trying this with node.js you should see something like:

```bash
Hello World!
Started ow application...
Hello World!
```