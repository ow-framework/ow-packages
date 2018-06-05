import { IOwApplication } from './Ow';

export interface IOwModule {
  new(app: IOwApplication): OwModule;
  app: IOwApplication;
  name: string;

  dependencies?: string[];
  requireEnv?: string[];

  load?(): Promise<any>;
  ready?(): Promise<any>;
  unload?(): Promise<any>;
  _ensureDependencies(): void;
}

const requireEnv = (env: string): boolean => typeof process.env[env] !== 'undefined';

/**
 * Base class for ow modules.
 *
 * @class OwModule
 */
export class OwModule implements OwModule {
  app: IOwApplication;
  name: string;

  dependencies?: string[];
  requireEnv?: string[];

  load: () => Promise<this>;
  ready: () => Promise<this>;

  /**
   * Each module receives the app instance it belongs to.
   * By utilizing this app instance, modules may set up routers,
   * event listeners and much more to build any kind of application.
   *
   * @param app application instance this module belongs to
   * @memberof OwModule
   */
  constructor(app: IOwApplication) {
    const self = this;

    this.app = app;
    this.name = this.constructor.name;

    this.load = function () { return Promise.resolve(self); }
    this.ready = function () { return Promise.resolve(self); }

    return this;
  }

  _ensureDependencies = () => {
    const self = this;

    if (self.dependencies) {
      self.dependencies.forEach(dep => {
        if (typeof self.app.modules[dep] === 'undefined') {
          throw new Error(`${self.name} depends on ${dep}, but ${dep} was not loaded before ${self.name}. Check your boot sequence.`);
        }
      });
    }

    if (self.requireEnv) {
      self.requireEnv.forEach(env => {
        if (!requireEnv(env)) {
          throw new Error(
            `${self.name} depends on global/env variable ${env}, but ${env} was not defined.\r\n` +
            (process ? `Make sure to set process.env.${env}.\r\n` : `Make sure to set window.${env} or global.${env}.\r\n`)
          );
        }
      });
    }
  }
}
