/// <reference types="koa-router" />
import * as Koa from 'koa';
declare module '@ow-framework/core' {
    interface Application {
        koa: Koa;
    }
}
