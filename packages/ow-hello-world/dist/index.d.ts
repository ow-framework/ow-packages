import * as Ow from '@ow-framework/core';
export interface IHelloWorldConfig {
    theString?: string;
    logger: typeof console.log;
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
    start: () => Promise<this>;
}
export default OwHelloWorldModule;
