import Ow from '@ow-framework/core';

import OwHelloWorld from './index';

describe('OwHelloWorld Module', () => {
  it('triggers logger when added', async () => {
    const app = new Ow({ silent: true });

    const logger = jest.fn();
    await app.addModules([
      new OwHelloWorld(app, { logger })
    ]);

    expect(logger.mock.calls.length).toBe(1);
  });

  it('triggers logger when started', async () => {
    const app = new Ow({ silent: true });

    const logger = jest.fn();
    await app.addModules([
      new OwHelloWorld(app, { logger })
    ]);

    await app.start();

    expect(logger.mock.calls.length).toBe(2);
  });
})