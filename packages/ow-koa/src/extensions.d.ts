import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { Server } from 'http';

declare module '@ow-framework/core/dist/types' {
  export interface ApplicationInstance {
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