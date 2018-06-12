import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as mount from 'koa-mount';
import * as koaStatic from 'koa-static';
import * as KoaBody from 'koa-body';
import * as Helmet from 'koa-helmet';
import * as Ow from '@ow-framework/core';

import { Server } from 'http';

import { IHelmetConfiguration } from 'helmet';

const getPort = require('get-port');

export interface IKoaConfig {
  port?: number;
  staticFolder?: string;
  enableBodyParser?: boolean | KoaBody.IKoaBodyOptions;
  enableHelmet?: boolean | IHelmetConfiguration;
};

declare module '@ow-framework/core' {
  interface IApplication {
    /** the url under which the server can be reached */
    uri: string;

    /** instance of the koa server **/
    koa: Koa;

    /** instance of koa router **/
    router: KoaRouter;

    /** http server instance **/
    server: Server;
  }
}

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
    staticFolder: './static/'
  };
  
  port?: number;
  koa: Koa;
  router: KoaRouter;
  server?: Server;

  constructor(app: Ow.IApplication, config: IKoaConfig = {}) {
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

    return this;
  }

  setPort = async () => {
    const { config } = this;

    if (config.port || process.env.PORT) {
      this.port = parseInt(
        config.port ? config.port.toString() : process.env.PORT || '',
        10
      );
    } else {
      this.port = await getPort();
    }

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

    process.on('exit', this.stop);

    return this;
  }


  stop = async () => {
    this.app.logger.info(`Closing server listening on http://localhost:${this.port}`);

    if (this.server) {
      await this.server.close();
    }

    return this;
  }
}
