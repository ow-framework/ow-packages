"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requireEnv = function (env) {
    return typeof process.env[env] !== 'undefined';
};
var OwModule = /** @class */ (function () {
    function OwModule(app, options) {
        var _this = this;
        this.config = {};
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
                            (process
                                ? "Make sure to set process.env." + env + ".\r\n"
                                : "Make sure to set window." + env + " or global." + env + ".\r\n"));
                    }
                });
            }
        };
        this.app = app;
        this.name = this.constructor.name;
        this.config = Object.assign({}, this.config, options);
        return this;
    }
    return OwModule;
}());
var OwModuleConstructor = OwModule;
exports.default = OwModuleConstructor;
//# sourceMappingURL=OwModule.js.map