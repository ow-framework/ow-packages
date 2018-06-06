"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("./lib");
var Application = /** @class */ (function () {
    function Application(_a) {
        var _b = (_a === void 0 ? {} : _a).silent, silent = _b === void 0 ? false : _b;
        this.env = process.env;
        this.logger = console;
        this.logLevel = process.env.LOG_LEVEL || 'info';
        this.modules = {};
        this.models = {};
        this.listeners = {
            load: [],
            ready: [],
            unload: [],
        };
        this.started = false;
        this.unhandledRejectionHandler = lib_1.noop;
        this.ensureDependencies = function (module, modules) {
            if (module.dependencies) {
                module.dependencies.forEach(function (dep) {
                    if (typeof modules[dep] === 'undefined') {
                        throw new Error(module.name + " depends on " + dep + ", but " + dep + " was not loaded before " + module.name + ". Check your boot sequence.");
                    }
                });
            }
            if (module.envDependencies) {
                module.envDependencies.forEach(function (env) {
                    if (!lib_1.requireEnv(env)) {
                        throw new Error(module.name + " depends on global/env variable " + env + ", but " + env + " was not defined.\r\n" +
                            (process
                                ? "Make sure to set process.env." + env + ".\r\n"
                                : "Make sure to set window." + env + " or global." + env + ".\r\n"));
                    }
                });
            }
        };
        if (typeof this.logger.debug === 'undefined') {
            this.logger.debug = this.logger.info;
        }
        if (silent) {
            this.logger = lib_1.noopLogger;
        }
        this.unhandledRejectionHandler = lib_1.unhandledRejection.bind(this, this.logger);
        process.on('unhandledRejection', this.unhandledRejectionHandler);
        return this;
    }
    Application.prototype.on = function (eventName, fn) {
        var _a;
        this.listeners = __assign({}, this.listeners, (_a = {}, _a[eventName] = this.listeners[eventName].concat([fn]), _a));
    };
    Application.prototype.off = function (eventName, fn) {
        if (this.listeners[eventName]) {
            this.listeners[eventName] = this.listeners[eventName].filter(function (cb) { return cb !== fn; }).slice();
        }
    };
    Application.prototype.trigger = function (eventName) {
        this.logger.debug("Event \"" + eventName + "\" fired");
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(function (fn) { return fn(); });
        }
    };
    Application.prototype.addModules = function (modules) {
        var _this = this;
        var self = this;
        var newModules = modules.reduce(function (acc, passedModule) {
            var name = passedModule.name;
            if (typeof passedModule === 'function') {
                var m = new passedModule(self);
                acc[name] = m;
            }
            else {
                acc[name] = passedModule;
            }
            // make sure module has a name
            if (typeof acc[name].name === 'undefined') {
                acc[name].name = name;
            }
            _this.ensureDependencies(acc[name], __assign({}, acc, _this.modules));
            return acc;
        }, {});
        this.modules = __assign({}, this.modules, newModules);
        return this.triggerModules('load', newModules)
            .then(function () { return _this; });
    };
    Application.prototype.triggerModules = function (event, modules) {
        var _this = this;
        if (modules === void 0) { modules = this.modules; }
        this.logger.debug("Triggering \"" + event + "\" on modules...");
        // nothing to load, exit
        var modulesToHandle = Object.keys(modules);
        if (!modulesToHandle.length)
            return new Promise(function (resolve) { return resolve(_this); });
        return new Promise(function (resolve, reject) {
            if (modulesToHandle.length) {
                var triggerModule_1 = function (module) {
                    _this.logger.debug(event + ": \"" + module.name + "\"");
                    // @ts-ignore
                    var promise = (module[event] || lib_1.getThenable)();
                    return (promise || lib_1.getThenable())
                        .then(function () {
                        if (modulesToHandle.length) {
                            // @ts-ignore
                            triggerModule_1(modules[modulesToHandle.shift()]);
                        }
                    })
                        .catch(reject);
                };
                // @ts-ignore
                triggerModule_1(modules[modulesToHandle.shift()])
                    .then(function () { return resolve(_this); })
                    .catch(function (err) {
                    _this.logger.error("Couldn't trigger " + event + " on modules.\r\n\r\n", err);
                    reject();
                });
            }
            resolve(_this);
        });
    };
    Application.prototype.start = function () {
        var _this = this;
        this.logger.info(this.started ? "Restarting ow application" : "Starting ow application.");
        var before = this.started
            ? Promise.resolve(this)
            : this.triggerModules('unload', this.modules);
        return before
            .then(function () { return _this.triggerModules('ready', _this.modules); })
            .then(function () {
            _this.logger.info("Started ow application.");
            _this.started = true;
        })
            .catch(function (e) {
            _this.logger.error(e);
            _this.logger.error('An error occured during the application start sequence.\r\n' +
                'This is probably not an issue with Ow but a module you loaded.\r\n' +
                'There is likely more logging output above.');
        });
    };
    Application.prototype.stop = function () {
        process.removeListener('unhandledRejection', this.unhandledRejectionHandler);
        if (this.started) {
            return this.triggerModules('unload', this.modules);
        }
        return Promise.resolve();
    };
    return Application;
}());
exports.default = Application;
//# sourceMappingURL=Application.js.map