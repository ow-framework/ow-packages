import * as Ow from '@ow-framework/core';
export interface IHelloWorldConfig {
    theString?: string;
}
/**
 * Example hello world module
 *
 * @class OwHelloWorldModule
 * @extends OwModule
 */
declare class OwHelloWorldModule extends Ow.OwModule {
    config: IHelloWorldConfig;
    constructor(app: Ow.IApplication, opts?: IHelloWorldConfig);
    load: () => Promise<this>;
    ready: () => Promise<this>;
}
export default OwHelloWorldModule;
