import { IApplication } from './Application';

export interface IModuleConfig {
  [key: string]: any

  name?: string;
}

export interface IModule {
  name: string;
  app: IApplication;
  dependencies?: string[];
  envDependencies?: string[];
  config?: IModuleConfig
}

export interface IModuleConstructor {
  new(app: IApplication, opts?: IModuleConfig): IModule
}

export class Module implements IModule {
  name: string;
  app: IApplication;
  dependencies?: string[];
  envDependencies?: string[];

  ready?: () => Promise<this> | this;
  load?: () => Promise<this> | this;
  unload?: () => Promise<this> | this;

  constructor(app: IApplication, config: IModuleConfig = {}) {
    this.name = config.name || this.constructor.name;
    this.app = app;

    return this;
  }
}

export default Module;
