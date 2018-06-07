import Ow from './Application';
import Module from './Module';

export const OwModule = Module;

export default Ow;

/** TYPINGS */

export type Events = 'load' | 'start' | 'stop' | string;

export type ModuleMap = {
  [key: string]: IModule;
};

export type ListenerMap = {
  start: Array<() => void>;
  stop: Array<() => void>;
  [event: string]: Array<() => void>;
};

export type ModelMap = { [key: string]: object };

export interface IApplicationOptions {
  silent?: boolean;
}

export interface ILogger {
  log: Function;
  info: Function;
  debug: Function;
  warn: Function;
  verbose?: Function;
}

export interface IApplication {
  logLevel: string;
  logger: ILogger;

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
  triggerModules: (
    event: Events | string,
    modules?: ModuleMap,
  ) => Promise<IApplication>;

  start(): PromiseLike<IApplication> | IApplication;
  stop(): PromiseLike<IApplication> | IApplication;
}

export interface IApplicationConstructor {
  new (opts?: IApplicationOptions): IApplication;
}

export interface IModuleOptions {
  [key: string]: any;

  name?: string;
}

export interface IModule {
  name: string;
  app: IApplication;
  dependencies?: string[];
  envDependencies?: string[];
  config?: IModuleOptions;
}

export interface IModuleConstructor {
  new (app: IApplication, opts?: IModuleOptions): IModule;
}
