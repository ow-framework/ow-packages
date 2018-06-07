import { IApplication, IModule, IModuleOptions } from './index';

export class Module implements IModule {
  name: string;
  app: IApplication;
  dependencies?: string[];
  envDependencies?: string[];

  ready?: () => Promise<this> | this;
  load?: () => Promise<this> | this;
  unload?: () => Promise<this> | this;

  constructor(app: IApplication, config: IModuleOptions = {}) {
    this.name = config.name || this.constructor.name;
    this.app = app;

    return this;
  }
}

export default Module;
