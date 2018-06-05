import * as Koa from 'koa';
declare module '@ow-framework/core/dist/types' {
    interface ApplicationInstance {
        koa?: Koa;
        router: string;
    }
}
declare module 'koa' {
    interface Context {
        $cache: {
            [key: string]: any;
        };
    }
}
