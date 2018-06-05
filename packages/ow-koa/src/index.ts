import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as mount from 'koa-mount';
import * as koaStatic from 'koa-static';
import * as getPort from 'get-port';

import { Server } from 'http';
import { OwModule } from '@ow-framework/core';

export interface IKoaConfig {
  port?: number;
  staticFolder?: string;
  enableBodyParser?: boolean;
  enableHelmet?: boolean;
  enablePMX?: boolean;
};

/**
 * ow module which adds koa to your application.
 *
 * @class OwKoa
 * @extends OwModule
 */
export default class OwKoa extends OwModule {
  config: IKoaConfig = {
    port: undefined,
    enableBodyParser: true,
    enableHelmet: true,
    staticFolder: './static/',
    enablePMX: false,
  };
  
  port?: number;
  koa?: Koa;
  server?: Server;

  load = async () => {
    const { app, config } = this;
  console.log("wow")
    app.koa = new Koa();
    app.router = new KoaRouter();

    app.koa.proxy = true;

    if (config.enableHelmet && process.env.NODE_ENV !== 'development') {
      app.koa.use(require('koa-helmet')());
    }

    if (config.enableBodyParser) {
      app.koa.use(require('koa-body')());
    }

    if (config.staticFolder) {
      app.koa.use(mount('/static', koaStatic(config.staticFolder)));
    }

    if (config.enablePMX) {
      const pm2 = require('../../helpers/pmx').default;
      const probe = pm2.probe();

      const meter = probe.meter({
        name: 'req/sec',
        samples: 1,
      });

      app.koa.use((ctx: Koa.Context, next: Function) => {
        meter.mark();
        return next();
      });
    }

    return this;
  }

  setPort = async () => {
    const { config } = this;

    this.port = parseInt(
      (config.port || process.env.PORT || await getPort()).toString(),
      10
    );

    if (process.env.NODE_ENV === 'test' && process.env.TEST_PORT) {
      this.port = parseInt(process.env.TEST_PORT, 10);
    }

    return this.port;
  }

  ready = async () => {
    const { app: { logger, koa, router } } = this;

    router.get('/checkConnection', (ctx: Koa.Context) => {
      ctx.status = 200;
      ctx.body = 'ok';
    });

    // attach a new $cache objcet for each request
    koa.use(async (ctx: Koa.Context, next: Function) => {
      ctx.$cache = {};
      await next();
    });

    // attach request time middleware
    koa.use(async (ctx: Koa.Context, next: Function) => {
      const start = Date.now();

      await next();

      logger.debug(`Time: ${Date.now() - start}ms`);
    });

    koa.use(router.routes());
    koa.use(router.allowedMethods());

    const port = await this.setPort();

    this.app.server = await koa.listen(port);
    this.server = this.app.server;

    this.app.uri = `http://localhost:${port}`;

    logger.info(`Server listening on http://localhost:${port}`);

    process.on('exit', this.unload);

    return this;
  }


  unload = async () => {
    this.app.logger.info(`Closing server listening on http://localhost:${this.port}`);

    if (this.server) {
      await this.server.close();
    }

    return this;
  }
}
