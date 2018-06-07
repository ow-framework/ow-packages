/// <reference types="node" />
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as KoaBody from 'koa-body';
import * as Ow from '@ow-framework/core';
import { Server } from 'http';
import { IHelmetConfiguration } from 'helmet';
export interface IKoaConfig {
    port?: number;
    staticFolder?: string;
    enableBodyParser?: boolean | KoaBody.IKoaBodyOptions;
    enableHelmet?: boolean | IHelmetConfiguration;
}
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
        $cache: {
            [key: string]: any;
        };
    }
}
/**
 * ow module which adds koa to your application.
 *
 * @class OwKoa
 * @extends OwModule
 */
export default class OwKoa extends Ow.OwModule {
    config: IKoaConfig;
    port?: number;
    koa: Koa;
    router: KoaRouter;
    server?: Server;
    constructor(app: Ow.IApplication, config?: IKoaConfig);
    setPort: () => Promise<number>;
    start: () => Promise<this>;
    stop: () => Promise<this>;
}
