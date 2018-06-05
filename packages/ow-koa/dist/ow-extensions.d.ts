import * as Koa from 'koa';
declare module '@ow-framework/core' {
    interface IApplication {
        koa: Koa;
    }
}
export {};
