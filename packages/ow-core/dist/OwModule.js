"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requireEnv = function (env) { return typeof process.env[env] !== 'undefined'; };
/**
 * Base class for ow modules.
 *
 * @class OwModule
 */
var OwModule = /** @class */ (function () {
    /**
     * Each module receives the app instance it belongs to.
     * By utilizing this app instance, modules may set up routers,
     * event listeners and much more to build any kind of application.
     *
     * @param app application instance this module belongs to
     * @memberof OwModule
     */
    function OwModule(app) {
        var _this = this;
        this._ensureDependencies = function () {
            var self = _this;
            if (self.dependencies) {
                self.dependencies.forEach(function (dep) {
                    if (typeof self.app.modules[dep] === 'undefined') {
                        throw new Error(self.name + " depends on " + dep + ", but " + dep + " was not loaded before " + self.name + ". Check your boot sequence.");
                    }
                });
            }
            if (self.requireEnv) {
                self.requireEnv.forEach(function (env) {
                    if (!requireEnv(env)) {
                        throw new Error(self.name + " depends on global/env variable " + env + ", but " + env + " was not defined.\r\n" +
                            (process ? "Make sure to set process.env." + env + ".\r\n" : "Make sure to set window." + env + " or global." + env + ".\r\n"));
                    }
                });
            }
        };
        var self = this;
        this.app = app;
        this.name = this.constructor.name;
        this.load = function () { return Promise.resolve(self); };
        this.ready = function () { return Promise.resolve(self); };
        return this;
    }
    return OwModule;
}());
exports.default = OwModule;
//# sourceMappingURL=OwModule.js.map