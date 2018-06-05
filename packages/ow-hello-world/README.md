# @ow-framework/hello-world

A simple hello world module for [@ow-framework](https://github.com/ow-framework/ow-packages/tree/master/packages/ow-core)

## Install

```bash
yarn add @ow-framework/hello-world
```

## Usage

```js
import Ow from '@ow-framework/core';
import OwHelloWorld from '@ow-framework/hello-world';

const app = new Ow();

app.addModules([
  OwHelloWorld
]);

app.start();
```

## Usage with options

```js
import Ow from '@ow-framework/core';
import OwHelloWorld from '@ow-framework/hello-world';

const app = new Ow();
const MyHelloWorld = new OwHelloWorld(app, {
  theString: 'Some teststring'
})

app.addModules([
  MyHelloWorld
]);

app.start();
```