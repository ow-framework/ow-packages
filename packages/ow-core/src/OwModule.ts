import {
  ModuleInstance,
  ModuleConstructor,
  IOwModuleConfig,
  ApplicationInstance,
} from './types';

const requireEnv = (env: string): boolean =>
  typeof process.env[env] !== 'undefined';

class OwModule implements ModuleInstance {
  app: ApplicationInstance;
  name: string;
  config: IOwModuleConfig = {};

  dependencies?: string[];
  requireEnv?: string[];

  load?: () => Promise<this>;
  ready?: () => Promise<this>;

  constructor(app: ApplicationInstance, options?: IOwModuleConfig) {
    this.app = app;
    this.name = this.constructor.name;
    this.config = Object.assign({}, this.config, options);

    return this;
  }

  _ensureDependencies = () => {
    const self = this;

    if (self.dependencies) {
      self.dependencies.forEach(dep => {
        if (typeof self.app.modules[dep] === 'undefined') {
          throw new Error(
            `${self.name} depends on ${dep}, but ${dep} was not loaded before ${
              self.name
            }. Check your boot sequence.`,
          );
        }
      });
    }

    if (self.requireEnv) {
      self.requireEnv.forEach(env => {
        if (!requireEnv(env)) {
          throw new Error(
            `${
              self.name
            } depends on global/env variable ${env}, but ${env} was not defined.\r\n` +
              (process
                ? `Make sure to set process.env.${env}.\r\n`
                : `Make sure to set window.${env} or global.${env}.\r\n`),
          );
        }
      });
    }
  };
}

const OwModuleConstructor: ModuleConstructor = OwModule;
export default OwModuleConstructor;
