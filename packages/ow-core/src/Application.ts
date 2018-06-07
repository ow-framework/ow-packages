import Module, { IModule, IModuleConstructor } from './Module';
import {
  noop,
  noopLogger,
  getThenable,
  unhandledRejection,
  requireEnv,
} from './lib';

type Events = 'load' | 'start' | 'stop' | string;

type ModuleMap = {
  [key: string]: IModule;
};

type ListenerMap = {
  start: Array<() => void>;
  stop: Array<() => void>;
  [event: string]: Array<() => void>;
};

type ModelMap = { [key: string]: object };

export interface ApplicationOptions {
  silent?: boolean;
}

export interface IApplication {
  logLevel: string;
  logger: Console;

  /** Mapping of ModuleName:ModuleInstance of all modules added with app.addModules() */
  modules: ModuleMap;
  /** The models app member should be used if you want to share Models between ow modules */
  models: ModelMap;

  listeners: ListenerMap;

  /**
   * Attach event listeners to ow application
   *
   * @param e Event name to add the listener for
   * @param fn Function to be called when event is triggered
   */
  on: (e: Events, fn: () => void) => void;

  /**
   * Remove event listeners to ow application
   *
   * @param e Event name from which to remove the listener
   * @param fn Function to be removed from event listener map
   */
  off: (e: Events, fn: () => void) => void;

  /**
   * Triggers given event on ow application.
   *
   * @param e Event name to be triggered
   */
  trigger: (e: Events) => void;

  /**
   * Adds modules to application instance and triggers their `load` function if available.
   *
   * @param modules[] Array of Module classes or Module instances to be added to the application
   * @returns Promise<this>
   */
  addModules: (modules: Array<IModule | IModuleConstructor>) => IApplication;

  /**
   * Triggers the given event or member function on all modules added to the app instance.
   *
   * @param event Event or function member name which should be called
   * @param modules The modules on which the event should be triggered (default: this.modules)
   */
  triggerModules: (event: Events | string, modules?: ModuleMap) => Promise<IApplication>;

  start(): PromiseLike<IApplication> | IApplication;
  stop(): PromiseLike<IApplication> | IApplication;
}

export interface ApplicationConstructor {
  new(opts?: ApplicationOptions): IApplication
}

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

  constructor({ silent = false }: ApplicationOptions = {}) {
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
  }

  triggerModules = (event: Events, modules = this.modules): Promise<IApplication> => {
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
            .catch(reject);
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

    const before: Promise<IApplication | this> = this.started
      ? Promise.resolve(this)
      : this.triggerModules('unload', this.modules);

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

const Ow: ApplicationConstructor = Application;

export default Ow;
