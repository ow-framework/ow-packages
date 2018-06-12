import Module from './Module';
import {
  noop,
  noopLogger,
  getThenable,
  unhandledRejection,
  requireEnv,
} from './lib';

import {
  IApplication,
  ModuleMap,
  ModelMap,
  ListenerMap,
  IApplicationOptions,
  Events,
  IModule,
  IModuleConstructor,
  IApplicationConstructor,
} from '.';

class Application implements IApplication {
  env = process.env;
  logger = console;
  logLevel = process.env.LOG_LEVEL || 'info';

  modules: ModuleMap = {};
  models: ModelMap = {};

  listeners: ListenerMap = {
    start: [],
    stop: [],
  };

  private started = false;
  private unhandledRejectionHandler: () => void = noop;

  constructor({ silent = false }: IApplicationOptions = {}) {
    if (typeof this.logger.debug === 'undefined') {
      this.logger.debug = this.logger.info;
    }

    if (silent) {
      this.logger = noopLogger;
    }

    this.unhandledRejectionHandler = unhandledRejection.bind(this, this.logger);

    process.on('unhandledRejection', this.unhandledRejectionHandler);

    return this;
  }

  on(eventName: Events, fn: () => void) {
    this.listeners = {
      ...this.listeners,
      [eventName]: [...this.listeners[eventName], fn],
    };
  }

  off(eventName: Events, fn: () => void) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = [
        ...this.listeners[eventName].filter(cb => cb !== fn),
      ];
    }
  }

  trigger(eventName: Events) {
    this.logger.debug(`Event "${eventName}" fired`);

    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(fn => fn());
    }
  }

  ensureDependencies = (module: IModule, modules: ModuleMap) => {
    if (module.dependencies) {
      module.dependencies.forEach(dep => {
        if (typeof modules[dep] === 'undefined') {
          throw new Error(
            `${
              module.name
            } depends on ${dep}, but ${dep} was not loaded before ${
              module.name
            }. Check your boot sequence.`,
          );
        }
      });
    }

    if (module.envDependencies) {
      module.envDependencies.forEach(env => {
        if (!requireEnv(env)) {
          throw new Error(
            `${
              module.name
            } depends on global/env variable ${env}, but ${env} was not defined.\r\n` +
              (process
                ? `Make sure to set process.env.${env}.\r\n`
                : `Make sure to set window.${env} or global.${env}.\r\n`),
          );
        }
      });
    }
  };

  addModules = (modules: Array<IModule | IModuleConstructor>): IApplication => {
    const self = this;
    const newModules = modules.reduce(
      (acc: ModuleMap, passedModule: IModule | IModuleConstructor) => {
        const name = passedModule.name;

        if (typeof passedModule === 'function') {
          const m = new passedModule(self);
          acc[name] = m;
        } else {
          acc[name] = passedModule;
        }

        // make sure module has a name
        if (typeof acc[name].name === 'undefined') {
          acc[name].name = name;
        }

        this.ensureDependencies(acc[name], { ...acc, ...this.modules });

        return acc;
      },
      {},
    );

    this.modules = { ...this.modules, ...newModules };

    return this;
  };

  triggerModules = (
    event: Events,
    modules = this.modules,
  ): Promise<IApplication> => {
    this.logger.debug(`Triggering "${event}" on modules...`);

    // nothing to load, exit
    const modulesToHandle: string[] = Object.keys(modules);
    if (!modulesToHandle.length) return Promise.resolve(this);

    return new Promise((resolve, reject) => {
      if (modulesToHandle.length) {
        const triggerModule = (module: Module): Promise<void> => {
          this.logger.debug(`${event}: "${module.name}"`);

          // @ts-ignore
          const promise: Promise<any> = (module[event] || getThenable)();

          return (promise || getThenable())
            .then(
              (): void => {
                if (modulesToHandle.length) {
                  // @ts-ignore
                  triggerModule(modules[modulesToHandle.shift()]);
                }
              },
            )
            .catch(err => {
              console.error(err);
              return reject(err);
            });
        };

        // @ts-ignore
        triggerModule(modules[modulesToHandle.shift()])
          .then(() => resolve(this))
          .catch((err: Error) => {
            this.logger.error(
              `Couldn't trigger ${event} on modules.\r\n\r\n`,
              err,
            );
            reject();
          });
      }

      resolve(this);
    });
  };

  start = (): Promise<this> => {
    this.logger.info(
      this.started ? `Restarting ow application` : `Starting ow application.`,
    );

    const before: Promise<IApplication | this> = !this.started
      ? Promise.resolve(this)
      : this.triggerModules('stop', this.modules);

    return before
      .then(() => this.triggerModules('start', this.modules))
      .then(() => {
        this.logger.info(`Started ow application.`);
        this.started = true;

        return this;
      })
      .catch(e => {
        this.logger.error(e);

        this.logger.error(
          'An error occured during the application start sequence.\r\n' +
            'This is probably not an issue with Ow but a module you loaded.\r\n' +
            'There is likely more logging output above.',
        );

        return this;
      });
  };

  stop = async (): Promise<IApplication> => {
    process.removeListener(
      'unhandledRejection',
      this.unhandledRejectionHandler,
    );

    if (this.started) {
      return this.triggerModules('stop', this.modules);
    }

    return Promise.resolve(this);
  };
}

const Ow: IApplicationConstructor = Application;

export default Ow;
