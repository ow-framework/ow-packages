import * as Ow from '@ow-framework/core';
import { IModuleConfig } from '../../ow-core/types/Module';
import { IApplication } from '../../ow-core/types/Application';

export interface IHelloWorldConfig extends IModuleConfig {
  theString?: string
};

const defaultOptions: IHelloWorldConfig = {
  theString: 'Hello world!'
};

/**
 * Example hello world module
 *
 * @class OwHelloWorldModule
 * @extends OwModule
 */
class OwHelloWorldModule extends Ow.OwModule {
  config: IHelloWorldConfig;

  constructor(app: IApplication, opts: IHelloWorldConfig = defaultOptions) {
    super(app, opts);

    this.config = Object.assign({}, defaultOptions, opts);
    
    return this;
  }

  load = async () => {
    const { config: { theString } } = this;

    console.log(`load: ${theString}`);

    return this;
  }

  ready = async () => {
    const { theString } = this.config;

    console.log(`ready: ${theString}`);

    return this;
  }
}

export default OwHelloWorldModule;
