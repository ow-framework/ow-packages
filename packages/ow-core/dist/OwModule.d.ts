import { IOwApplication } from './Ow';
export interface IOwModule {
    new (app: IOwApplication): OwModule;
    app: IOwApplication;
    name: string;
    dependencies?: string[];
    requireEnv?: string[];
    load?(): Promise<any>;
    ready?(): Promise<any>;
    unload?(): Promise<any>;
    _ensureDependencies(): void;
}
/**
 * Base class for ow modules.
 *
 * @class OwModule
 */
export declare class OwModule implements OwModule {
    app: IOwApplication;
    name: string;
    dependencies?: string[];
    requireEnv?: string[];
    load: () => Promise<this>;
    ready: () => Promise<this>;
    /**
     * Each module receives the app instance it belongs to.
     * By utilizing this app instance, modules may set up routers,
     * event listeners and much more to build any kind of application.
     *
     * @param app application instance this module belongs to
     * @memberof OwModule
     */
    constructor(app: IOwApplication);
    _ensureDependencies: () => void;
}
