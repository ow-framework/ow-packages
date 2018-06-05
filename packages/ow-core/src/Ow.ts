import * as Ow from './types';
import OwModule from './OwModule';

function noop():void {}
const noopLogger = <Console>{ info: noop, log: noop, debug: noop, error: noop, warn: noop, };

function unhandledRejection(logger: Console, error: Error) {
  logger.error(error);
}

class Application implements Ow.IApplication {
  env = process.env;
  logger = console;
  logLevel = process.env.LOG_LEVEL || 'info';

  modules = {};
  models = {};

  private listeners: Ow.ListenerMap = {
    load: [],
    ready: [],
    unload: [],
    _ensureDependencies: [],
  };
  private started = false;
  private unhandledRejectionHandler: ()=>void = noop;

  constructor({ silent = false } = {}) {
    if (typeof this.logger.debug === 'undefined')  {
      this.logger.debug = this.logger.info;
    }

    if (silent) {
      this.logger = noopLogger;
    }

    this.unhandledRejectionHandler = unhandledRejection.bind(this, this.logger);

    process.on("unhandledRejection", this.unhandledRejectionHandler);
  }

  on(eventName: Ow.Events, fn: Function): Ow.IApplication {
    this.listeners = {
      ...this.listeners,
      [eventName]: [...this.listeners[eventName], fn]
    };

    return this;
  }

  off(eventName: Ow.Events, fn: Function): Ow.IApplication {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = [
        ...this.listeners[eventName].filter(cb => cb !== fn)
      ];
    }

    return this;
  }

  trigger(eventName: Ow.Events): Ow.IApplication {
    this.logger.debug(`Event "${eventName}" fired`);

    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(fn => fn());
    }

    return this;
  }

  addModules(modules: OwModule[]) {
    const newModules = modules.reduce((acc: Ow.ModuleMap, Module) => {
      const name = Module.name;

      if (typeof Module === "function") {
        const m = new OwModule(this);

        acc[name] = m;
      } else {
        acc[name] = Module;
      }

      // make sure module has a name
      if (typeof acc[name].name === 'undefined')  {
        acc[name].name = name;
      }

      return acc;
    }, {});

    this.modules = {
      ...this.modules,
      ...newModules,
    };

    return this._triggerModules('_ensureDependencies', newModules)
      .then(() => this._triggerModules('load', newModules))
      .then(() => this);
  }

  _triggerModules(event: Ow.Events, modules = this.modules): Promise<void> {
    this.logger.debug(`Triggering "${event}" on modules...`);

    // nothing to load, exit
    if (!Object.keys(modules).length) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const modulesToHandle: string[] = Object.keys(modules);

      if (modulesToHandle.length) {
        const triggerModule = (module: Ow.IModule): Promise<void> => {
          this.logger.debug(`${event}: "${module.name}"`);

          let result: any = (module[event] || function () { return Promise.resolve(); })();

          if (typeof result === 'undefined') {
            result = Promise.resolve();
          }

          return result.then((): void => {
              if (modulesToHandle.length) {
                // @ts-ignore
                triggerModule(modules[modulesToHandle.shift()]);
              }
            })
            .catch(reject);
        }

          // @ts-ignore
          return triggerModule(modules[modulesToHandle.shift()])
            .then(resolve)
            .catch((err: Error) => {
              this.logger.error(`Couldn't trigger ${event} on modules.\r\n\r\n`, err);
              reject();
            });
        }
        
        return resolve();
    });
  }

  start() {
    this.logger.info(this.started ? `Restarting ow application` : `Starting ow application.`);

    let before: Promise<void> = Promise.resolve();

    if (this.started) {
      before = this._triggerModules("unload", this.modules);
    }

    return before
      .then(() => this._triggerModules("ready", this.modules))
      .then(() => {
        this.logger.info(`Started ow application.`);
        this.started = true;
      })
      .catch(e => {
        this.logger.error(e);

        this.logger.error(
          "An error occured during the application start sequence.\r\n" +
          "This is probably not an issue with Ow but a module you loaded.\r\n" +
          "There is likely more logging output above."
        );
      });
  }

  stop() {
    process.removeListener('unhandledRejection', this.unhandledRejectionHandler);

    if (this.started) {
      return this._triggerModules("unload", this.modules);
    }

    return Promise.resolve();
  }
}

export default Application;
