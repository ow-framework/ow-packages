# @ow-framework/koa

The power and elegance of [koa](https://github.com/koajs/koa) in your [@ow-framework](https://github.com/ow-framework/ow-packages) application.

## Install

```bash
yarn add @ow-framework/koa
```

## Usage

```js
import Ow from '@ow-framework/core';
import OwKoa from '@ow-framework/koa';

const app = new Ow();

app.addModules([
  OwKoa
]);

app.start();
```

This will start a server, listening on `process.env.port` or some random port if it's not specified.

## Usage with options

```js
import Ow from '@ow-framework/core';
import OwKoa from '@ow-framework/koa';

const app = new Ow();
const Koa = new OwKoa(app, {
  port: 7777
})

app.addModules([
  Koa
]);

app.start();
```