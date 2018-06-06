import * as sinon from 'sinon';

import Application from './Application';
import Module from './Module';

describe('Application', () => {
  it('return as instanceof Application', () => {
    const app = new Application();

    expect(app).toBeInstanceOf(Application);
  });

  it('triggers "load" function on modules when added', async () => {
    const app = new Application({ silent: true });

    const loadSpy = sinon.fake.returns(new Promise(resolve => resolve(app)));
    const readySpy = sinon.fake.returns(new Promise(resolve => resolve(app)));

    class TestModule extends Module {
      load = async () => loadSpy();
      ready = async () => readySpy();
    }

    expect(loadSpy.notCalled).toBeTruthy();

    await app.addModules([TestModule]);

    expect(loadSpy.calledOnce).toBeTruthy();
    expect(readySpy.notCalled).toBeTruthy();

    await app.start();

    expect(loadSpy.calledOnce).toBeTruthy();
    expect(readySpy.calledOnce).toBeTruthy();
  });
})