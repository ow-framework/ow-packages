import * as sinon from 'sinon';

import App from './Application';
import Module from './Module';

describe('Module', () => {
  it('can be instantiated', () => {
    const app = new App();
    const instance = new Module(app);

    expect(instance).toBeInstanceOf(Module);
  });

  it("sets it's constructors name as a member", () => {
    const app = new App();
    const instance = new Module(app);

    expect(instance.name).toBe('Module');
  });

  it('can be used as base class for custom modules', () => {
    const app = new App();

    class CustomModule extends Module {}
    const instance = new CustomModule(app);

    expect(instance.name).toBe('CustomModule');
    expect(instance.app).toBe(app);
  });

  it(`module instance can be added to app`, async () => {
    const app = new App({ silent: true });
    const instance = new Module(app);

    await app.addModules([instance]);

    expect(app.modules.Module).toBeTruthy();
  });

  it(`can overwrite ready and load functions
      which will be triggered during
      ow application lifecycle
      `, async () => {
    const app = new App({ silent: true });

    const load = sinon.fake.returns(new Promise(resolve => resolve(app)));
    const ready = sinon.fake.returns(new Promise(resolve => resolve(app)));

    class CustomModule extends Module {
      load = load;
      ready = ready;
    }

    const instance = new CustomModule(app);

    await app.addModules([instance]);

    expect(instance.name).toBe('CustomModule');
    expect(load.calledOnce).toBeTruthy();
    expect(ready.notCalled).toBeTruthy();
  });

  it(`throws if dependency module does not exist`, async () => {
    const app = new App({ silent: true });

    class CustomModule extends Module {
      dependencies = ['DOES_NOT_EXIST'];
    }

    try {
      await app.addModules([CustomModule]);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it(`does not throw if dependency module exists`, async () => {
    const app = new App({ silent: true });

    class CustomModule extends Module { }
    class WithDepModule extends Module {
      dependencies = ['CustomModule'];
    }

    try {
      await app.addModules([CustomModule, WithDepModule]);
      expect(true).toBeTruthy();
    } catch (err) {
      expect(err).toBeFalsy();
    }
  });

  it(`respects order in which modules are added when ensuring dependencies`, async () => {
    const app = new App({ silent: true });

    class CustomModule extends Module { }
    class WithDepModule extends Module {
      dependencies = ['CustomModule'];
    }

    try {
      await app.addModules([WithDepModule, CustomModule]);
      expect(true).toBeFalsy();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});
