/// <reference types="node" />
export declare function noop(): void;
export declare function getThenable(): Promise<void>;
export declare function unhandledRejection(logger: Console, error: Error): void;
export declare const noopLogger: Console;
export declare const requireEnv: (name: string) => boolean;
