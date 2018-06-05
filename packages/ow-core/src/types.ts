/// <reference types="node" />

declare namespace Ow {
  interface IOwModuleConfig {
    [key: string]: any;
  }

  interface ModuleConstructor {
    new(app: ApplicationInstance, options?: IOwModuleConfig): ModuleInstance;
  }

  interface ModuleInstance {
    app: ApplicationInstance;
    name: string;
    config: IOwModuleConfig;

    dependencies?: string[];
    requireEnv?: string[];

    load?: () => Promise<this>;
    ready?: () => Promise<this>;
    unload?: () => Promise<this>;
    _ensureDependencies(): void;
  }

  type ListenerMap = {
    load: Function[];
    ready: Function[];
    unload: Function[];
    _ensureDependencies: Function[];
  };

  type Events = 'load' | 'ready' | 'unload' | '_ensureDependencies';
  type ModuleMap = { [key: string]: ModuleInstance };
  type ModelMap = {
    [key: string]: object;
  };

  export interface ApplicationInstance {
    env: { [key: string]: string | undefined };
    logger: Console;
    logLevel: string;
    modules: ModuleMap;
    models: ModelMap;
  }

  interface ApplicationConstructor {
    new(options?: IOwModuleConfig): ApplicationInstance
  }
}

export = Ow;