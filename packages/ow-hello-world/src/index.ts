import { OwModule, IOwApplication } from '@ow-framework/core';

export interface IHelloWorldConfig {
  theString?: string
};

/**
 * Example hello world module
 *
 * @class OwHelloWorldModule
 * @extends OwModule
 */
class OwHelloWorldModule extends OwModule {
  config: IHelloWorldConfig;

  constructor(app: IOwApplication, opts: IHelloWorldConfig) {
    super(app);

    this.config = {
      theString: 'Hello World!',
      ...opts,
    };

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
