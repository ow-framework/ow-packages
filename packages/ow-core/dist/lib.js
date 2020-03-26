"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function noop() { }
exports.noop = noop;
function getThenable() {
    return Promise.resolve();
}
exports.getThenable = getThenable;
function unhandledRejection(logger, reason) {
    logger.error(reason);
}
exports.unhandledRejection = unhandledRejection;
exports.noopLogger = {
    info: noop,
    log: noop,
    debug: noop,
    error: noop,
    warn: noop,
};
exports.requireEnv = function (name) {
    return typeof process.env[name] !== 'undefined';
};
//# sourceMappingURL=lib.js.map