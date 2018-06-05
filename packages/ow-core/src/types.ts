export declare interface IModule {
  app: IApplication;
  name: string;

  dependencies?: string[];
  requireEnv?: string[];

  _ensureDependencies(): void;

  load?(): Promise<any>;
  ready?(): Promise<any>;
  unload?(): Promise<any>;
  _ensureDependencies(): void;
}

export type Events = 'load' | 'ready' | 'unload' | '_ensureDependencies';

export type ListenerMap = {
  load: Function[],
  ready: Function[],
  unload: Function[],
  _ensureDependencies: Function[],
};

export type ModuleMap = {
  [key: string]: IModule
};

export type ModelMap = {
  [key: string]: object
};

export declare interface IApplication {
  env: object;
  logger: Console;
  logLevel: string;

  modules: ModuleMap;
  models: ModelMap;
}