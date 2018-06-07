import { IApplication } from './Application';
export interface IModuleConfig {
    [key: string]: any;
    name?: string;
}
export interface IModule {
    name: string;
    app: IApplication;
    dependencies?: string[];
    envDependencies?: string[];
    config?: IModuleConfig;
}
export interface IModuleConstructor {
    new (app: IApplication, opts?: IModuleConfig): IModule;
}
export declare class Module implements IModule {
    name: string;
    app: IApplication;
    dependencies?: string[];
    envDependencies?: string[];
    ready?: () => Promise<this> | this;
    load?: () => Promise<this> | this;
    unload?: () => Promise<this> | this;
    constructor(app: IApplication, config?: IModuleConfig);
}
export default Module;
