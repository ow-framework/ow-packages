/// <reference types="node" />
import * as Koa from 'koa';
import { Server } from 'http';
import { OwModule } from '@ow-framework/core';
export interface IKoaConfig {
    port?: number;
    staticFolder?: string;
    enableBodyParser?: boolean;
    enableHelmet?: boolean;
    enablePMX?: boolean;
}
/**
 * ow module which adds koa to your application.
 *
 * @class OwKoa
 * @extends OwModule
 */
export default class OwKoa extends OwModule {
    config: IKoaConfig;
    port?: number;
    koa?: Koa;
    server?: Server;
    load: () => Promise<this>;
    setPort: () => Promise<number>;
    ready: () => Promise<this>;
    unload: () => Promise<this>;
}
