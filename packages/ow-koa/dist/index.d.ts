/// <reference types="node" />
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import * as KoaBody from 'koa-body';
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
    constructor(app: IApplication, config?: IKoaConfig);
    setPort: () => Promise<number>;
    start: () => Promise<this>;
    unload: () => Promise<this>;
}
