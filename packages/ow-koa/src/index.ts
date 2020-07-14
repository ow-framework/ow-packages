import * as Koa from 'koa';
import * as KoaRouter from '@koa/router';
import * as mount from 'koa-mount';
import * as koaStatic from 'koa-static';
import * as KoaBody from 'koa-body';
import * as Helmet from 'koa-helmet';
import Debug from 'debug';
import * as Ow from '@ow-framework/core';

import { Server } from 'http';

import { IHelmetConfiguration } from 'helmet';

const getPort = require('get-port');
const debug = Debug('ow-koa');

export interface IKoaConfig {
  /** Port to listen for requests (default: random available port via get-port https://www.npmjs.com/package/get-port) */
  port?: number;

  /** If configured, serves the given path under /static route (default: undefined) */
  staticFolder?: string;

  /** If enabled, will apply body parser middleware on all requests (default: true) https://www.npmjs.com/package/koa-body */
  enableBodyParser?: boolean | KoaBody.IKoaBodyOptions;

  /** If enabled, will apply helmet middleware on all requests (default: true) https://www.npmjs.com/package/koa-helmet */
  enableHelmet?: boolean | IHelmetConfiguration;
  
  /** Enables/Disables request time middleware (such as request time logging) (default: false) */
  enableRequestTimeMiddleware?: boolean;

  /** Enables/Disables context $cache middleware (default: false) */
  enableContextCacheMiddleware?: boolean;
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
  interface BaseContext {
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
    enableRequestTimeMiddleware: false,
    enableContextCacheMiddleware: false,
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

    this.config = Object.assign(this.config, config);

    if (this.config.enableHelmet) {
      const helmetOptions = typeof this.config.enableHelmet === 'object' ? this.config.enableHelmet : undefined;
      app.koa.use(Helmet(helmetOptions));
    }

    if (this.config.enableBodyParser) {
      const bodyOptions = typeof this.config.enableBodyParser === 'object' ? this.config.enableBodyParser : undefined;
      app.koa.use(KoaBody(bodyOptions));
    }

    if (this.config.staticFolder) {
      app.koa.use(mount('/static', koaStatic(this.config.staticFolder)));
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

    if (this.config.enableContextCacheMiddleware) {
      // attach a new $cache objcet for each request
      koa.use(async (ctx: Koa.Context, next: Function) => {
        ctx.$cache = {};
        await next();
      });
    }

    if (this.config.enableRequestTimeMiddleware) {
      // attach request time middleware
      koa.use(async (ctx: Koa.Context, next: Function) => {
        const start = Date.now();

        await next();

        debug(`Time: ${Date.now() - start}ms`);
      });
    }

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
