import Ow from '@ow-framework/core';
import * as Koa from 'koa';
import * as KoaRouter from '@koa/router';
import * as request from 'supertest';

import OwKoa from './index';

describe('Application', () => {
  async function setupOw() {
    const app = new Ow({ silent: true });
    const Koa = new OwKoa(app);

    await app.addModules([
      Koa
    ]);

    return app;
  }

  it('attaches koa on app object', async () => {
    const app = await setupOw();

    expect(app.koa).toBeInstanceOf(Koa);

    app.stop();
  });

  it('wont respond before app is started', async () => {
    const app = await setupOw();

    const res = await request(app.koa.callback())
      .get('/checkConnection')
      .expect(404);

    expect(res.text).toBe('Not Found');

    app.stop();
  });

  it('will respond with 200 ok on /checkConnection route', async () => {
    const app = await setupOw();

    await app.start();

    const res = await request(app.koa.callback())
      .get('/checkConnection')
      .expect(200);

    expect(res.text).toBe('ok');

    app.stop();
  });

  it('attaches koa router on app.router', async () => {
    const app = await setupOw();

    await app.start();

    expect(app.router).toBeInstanceOf(KoaRouter);

    app.stop();
  });

  it('allow route configuration with app.router', async () => {
    const app = await setupOw();

    await app.start();

    app.router.get('/test-route', (ctx: Koa.BaseContext) => ctx.body = 'it works');


    const res = await request(app.koa.callback())
      .get('/test-route')
      .expect(200);

    expect(res.text).toBe('it works');

    app.stop();
  });
})
