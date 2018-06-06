/// <reference types="node" />
import { IModule, IModuleConstructor } from './Module';
declare type Events = 'load' | 'ready' | 'unload' | string;
declare type ModuleMap = {
    [key: string]: IModule;
};
declare type ListenerMap = {
    load: Array<() => void>;
    ready: Array<() => void>;
    unload: Array<() => void>;
    [event: string]: Array<() => void>;
};
declare type ModelMap = {
    [key: string]: object;
};
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
     * Adds modules to application instance and triggers their `load` function if available.
     *
     * @param modules[] Array of Module classes or Module instances to be added to the application
     * @returns Promise<this>
     */
    addModules: (modules: Array<IModule | IModuleConstructor>) => Promise<this>;
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
     * Triggers the given event or member function on all modules added to the app instance.
     *
     * @param event Event or function member name which should be called
     * @param modules The modules on which the event should be triggered (default: this.modules)
     */
    triggerModules: (event: Events | string, modules?: ModuleMap) => Promise<IApplication>;
}
declare class Application implements IApplication {
    env: NodeJS.ProcessEnv;
    logger: Console;
    logLevel: string;
    modules: ModuleMap;
    models: ModelMap;
    listeners: ListenerMap;
    private started;
    private unhandledRejectionHandler;
    constructor({ silent }?: {
        silent?: boolean;
    });
    on(eventName: Events, fn: () => void): void;
    off(eventName: Events, fn: () => void): void;
    trigger(eventName: Events): void;
    ensureDependencies: (module: IModule, modules: ModuleMap) => void;
    addModules(modules: Array<IModule | IModuleConstructor>): Promise<this>;
    triggerModules(event: Events, modules?: ModuleMap): Promise<this>;
    start(): Promise<void>;
    stop(): Promise<this> | Promise<void>;
}
export default Application;
