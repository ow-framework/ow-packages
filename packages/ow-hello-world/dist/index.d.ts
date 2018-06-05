import { OwModule, ApplicationInstance } from '@ow-framework/core';
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
    constructor(app: ApplicationInstance, opts?: IHelloWorldConfig);
    load: () => Promise<this>;
    ready: () => Promise<this>;
}
export default OwHelloWorldModule;
