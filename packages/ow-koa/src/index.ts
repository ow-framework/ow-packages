/// <reference path="./ambient.d.ts"
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as mount from 'koa-mount';
import * as koaStatic from 'koa-static';
import * as KoaBody from 'koa-body';
import * as Helmet from 'koa-helmet';
import * as getPort from 'get-port';
import * as Ow from '@ow-framework/core';

import { Server } from 'http';

import { IHelmetConfiguration } from 'helmet';
import { IApplication } from '../../ow-core/types/Application';

export interface IKoaConfig {
  port?: number;
  staticFolder?: string;
  enableBodyParser?: boolean | KoaBody.IKoaBodyOptions;
  enableHelmet?: boolean | IHelmetConfiguration;
  enablePMX?: boolean;
};

declare module 'koa' {
  interface Context {
    $cache: { [key: string]: any }
  }
}

/**
 * ow module which adds koa to your application.
 *
 * @class OwKoa
 * @extends OwModule
 */
export default class OwKoa extends Ow.OwModule {
  config: IKoaConfig = {
    port: undefined,
    enableBodyParser: true,
    enableHelmet: true,
    staticFolder: './static/',
    enablePMX: false,
  };
  
  port?: number;
  koa: Koa;
  router: KoaRouter;
  server?: Server;

  constructor(app: IApplication, config: IKoaConfig = {}) {
    super(app);

    this.koa = app.koa = new Koa();
    this.router = app.router = new KoaRouter();

    app.koa.proxy = true;

    if (config.enableHelmet) {
      const helmetOptions = typeof config.enableHelmet === 'object' ? config.enableHelmet : undefined;
      app.koa.use(Helmet(helmetOptions));
    }

    if (config.enableBodyParser) {
      const bodyOptions = typeof config.enableBodyParser === 'object' ? config.enableBodyParser : undefined;
      app.koa.use(KoaBody(bodyOptions));
    }

    if (config.staticFolder) {
      app.koa.use(mount('/static', koaStatic(config.staticFolder)));
    }

    if (config.enablePMX) {
      const pm2 = require('../../helpers/pmx').default;
      const probe = pm2.probe();

      const meter = probe.meter({ name: 'req/sec', samples: 1 });

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

  start = async () => {
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
