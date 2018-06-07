import * as sinon from 'sinon';
import { IApplication } from './index';

import Application from './Application';
import Module from './Module';

describe('Application', () => {
  it('Return as instanceof Application', () => {
    const app = new Application();

    expect(app).toBeInstanceOf(Application);
  });

  it('Creates and adds new Module instance when Module Constructor is added', async () => {
    const app = new Application({ silent: true });

    const constructorSpy = sinon.fake.returns(new Promise(resolve =>
        resolve(app),
      ));
    const startSpy = sinon.fake.returns(new Promise(resolve => resolve(app)));

    class TestModule extends Module {
      itworks?: boolean;

      constructor(app: IApplication) {
        super(app);
        constructorSpy();
        this.itworks = true;
      }

      start = startSpy;
    }

    expect(constructorSpy.notCalled).toBeTruthy();

    await app.addModules([TestModule]);

    expect(constructorSpy.calledOnce).toBeTruthy();
    expect(startSpy.notCalled).toBeTruthy();

    await app.start();

    expect(constructorSpy.calledOnce).toBeTruthy();
    expect(startSpy.calledOnce).toBeTruthy();
  });

  it('Adds module instances to app when passed to addModules', async () => {
    const app = new Application({ silent: true });

    const constructorSpy = sinon.fake.returns(new Promise(resolve =>
        resolve(app),
      ));
    const startSpy = sinon.fake.returns(new Promise(resolve => resolve(app)));

    class TestModule extends Module {
      itworks?: boolean;

      constructor(app: IApplication) {
        super(app);
        constructorSpy();
        this.itworks = true;
      }

      start = startSpy;
    }

    const Test = new TestModule(app);

    expect(constructorSpy.calledOnce).toBeTruthy();

    await app.addModules([Test]);

    expect(constructorSpy.calledOnce).toBeTruthy();
    expect(startSpy.notCalled).toBeTruthy();

    await app.start();

    expect(constructorSpy.calledOnce).toBeTruthy();
    expect(startSpy.calledOnce).toBeTruthy();

    expect(app.modules.TestModule).toBeTruthy();
  });
})