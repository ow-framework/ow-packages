export function noop(): void {}

export function getThenable(): Promise<void> {
  return Promise.resolve();
}

export function unhandledRejection(logger: Console, error: Error) {
  logger.error(error);
}

export const noopLogger = <Console>{
  info: noop,
  log: noop,
  debug: noop,
  error: noop,
  warn: noop,
};

export const requireEnv = (name: string) =>
  typeof process.env[name] !== 'undefined';