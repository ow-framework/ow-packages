import { IApplication } from './Application';

export interface IModuleConfig {
  [key: string]: any
}

export interface IModule {
  name: string;
  app: IApplication;
  dependencies?: string[];
  envDependencies?: string[];
  config?: IModuleConfig
}

export interface IModuleConstructor {
  new(app: IApplication): IModule
}

export class Module implements IModule {
  name: string;
  app: IApplication;
  dependencies?: string[];
  envDependencies?: string[];

  ready?: () => Promise<this> | this;
  load?: () => Promise<this> | this;
  unload?: () => Promise<this> | this;

  constructor(app: IApplication) {
    this.name = this.constructor.name;
    this.app = app;

    return this;
  }
}

export default Module;
