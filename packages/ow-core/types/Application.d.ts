/// <reference types="node" />
import { IModule, IModuleConstructor } from './Module';
declare type Events = 'load' | 'start' | 'stop' | string;
declare type ModuleMap = {
    [key: string]: IModule;
};
declare type ListenerMap = {
    start: Array<() => void>;
    stop: Array<() => void>;
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
    triggerModules: (event: Events | string, modules?: ModuleMap) => Promise<IApplication>;
    start(): PromiseLike<IApplication> | IApplication;
    stop(): PromiseLike<IApplication> | IApplication;
}
export interface ApplicationConstructor {
    new (opts?: ApplicationOptions): IApplication;
}
declare const Ow: ApplicationConstructor;
export default Ow;
