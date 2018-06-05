import { OwModule, IOwApplication } from '@ow-framework/core';
export interface IHelloWorldConfig {
    theString?: string;
}
/**
 * Example hello world module
 *
 * @class OwHelloWorldModule
 * @extends OwModule
 */
declare class OwHelloWorldModule extends OwModule {
    config: IHelloWorldConfig;
    constructor(app: IOwApplication, opts: IHelloWorldConfig);
    load: () => Promise<this>;
    ready: () => Promise<this>;
}
export default OwHelloWorldModule;
