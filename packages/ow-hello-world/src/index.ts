import * as Ow from '@ow-framework/core';

export interface IHelloWorldConfig {
  theString?: string,
  logger: typeof console.log
};

const defaultOptions: IHelloWorldConfig = {
  theString: 'Hello world!',
  logger: console.log
};

/**
 * Example hello world module
 *
 * @class OwHelloWorldModule
 * @extends OwModule
 */
class OwHelloWorldModule extends Ow.OwModule {
  config: IHelloWorldConfig;

  constructor(app: Ow.IApplication, opts: IHelloWorldConfig = defaultOptions) {
    super(app, opts);

    this.config = Object.assign({}, defaultOptions, opts);

    this.config.logger(`construct: ${this.config.theString}`);
    
    return this;
  }

  start = async () => {
    const { theString, logger } = this.config;

    logger(`start: ${theString}`);

    return this;
  }
}

export default OwHelloWorldModule;
