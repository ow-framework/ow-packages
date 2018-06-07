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

  it("sets its name member to passed config.name if available", () => {
    const app = new App();
    const instance = new Module(app, { name: "Different Name" });

    expect(instance.name).toBe('Different Name');
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

  it(`can overwrite start function
      which will be triggered during
      ow application lifecycle
      `, async () => {
    const app = new App({ silent: true });

    const start = sinon.fake.returns(new Promise(resolve => resolve(app)));

    class CustomModule extends Module {
      start = start;
    }

    const instance = new CustomModule(app);

    app.addModules([instance]);

    expect(instance.name).toBe('CustomModule');
    expect(start.calledOnce).toBeFalsy();

    await app.start();

    expect(start.calledOnce).toBeTruthy();
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
      app.addModules([CustomModule, WithDepModule]);
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
      app.addModules([CustomModule, WithDepModule]);
      expect(true).toBeFalsy();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});
