import * as Ow from '@ow-framework/core';
import { IModuleConfig } from '../../ow-core/types/Module';
import { IApplication } from '../../ow-core/types/Application';
export interface IHelloWorldConfig extends IModuleConfig {
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
    constructor(app: IApplication, opts?: IHelloWorldConfig);
    load: () => Promise<this>;
    ready: () => Promise<this>;
}
export default OwHelloWorldModule;
