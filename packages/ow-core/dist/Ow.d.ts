/// <reference path="OwModule.d.ts" />
/// <reference types="node" />
import { OwModule } from './OwModule';
export declare type Events = 'load' | 'ready' | 'unload' | '_ensureDependencies';
export declare type ListenerMap = {
    load: Function[];
    ready: Function[];
    unload: Function[];
    _ensureDependencies: Function[];
};
export declare type ModuleMap = {
    [key: string]: OwModule;
};
export declare type ModelMap = {
    [key: string]: object;
};
export interface IOwApplication {
    env: {
        [key: string]: string | undefined;
    };
    logger: Console;
    logLevel: string;
    modules: ModuleMap;
    models: ModelMap;
}
export declare class Application implements IOwApplication {
    env: NodeJS.ProcessEnv;
    logger: Console;
    logLevel: string;
    modules: ModuleMap;
    models: ModelMap;
    private listeners;
    private started;
    private unhandledRejectionHandler;
    constructor({ silent }?: {
        silent?: boolean;
    });
    on(eventName: Events, fn: Function): Application;
    off(eventName: Events, fn: Function): Application;
    trigger(eventName: Events): Application;
    addModules(modules: OwModule[]): Promise<this>;
    _triggerModules(event: Events, modules?: ModuleMap): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
