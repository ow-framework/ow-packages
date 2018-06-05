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
function noop() { }
function getThenable() {
    return Promise.resolve();
}
var OwInstance = /** @class */ (function () {
    function OwInstance(_a) {
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
            _ensureDependencies: [],
        };
        this.started = false;
        this.unhandledRejectionHandler = noop;
        if (typeof this.logger.debug === 'undefined') {
            this.logger.debug = this.logger.info;
        }
        if (silent) {
            this.logger = noopLogger;
        }
        this.unhandledRejectionHandler = unhandledRejection.bind(this, this.logger);
        process.on('unhandledRejection', this.unhandledRejectionHandler);
        return this;
    }
    OwInstance.prototype.on = function (eventName, fn) {
        var _a;
        this.listeners = __assign({}, this.listeners, (_a = {}, _a[eventName] = this.listeners[eventName].concat([fn]), _a));
        return this;
    };
    OwInstance.prototype.off = function (eventName, fn) {
        if (this.listeners[eventName]) {
            this.listeners[eventName] = this.listeners[eventName].filter(function (cb) { return cb !== fn; }).slice();
        }
        return this;
    };
    OwInstance.prototype.trigger = function (eventName) {
        this.logger.debug("Event \"" + eventName + "\" fired");
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(function (fn) { return fn(); });
        }
        return this;
    };
    OwInstance.prototype.addModules = function (modules) {
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
            return acc;
        }, {});
        this.modules = __assign({}, this.modules, newModules);
        return this._triggerModules('_ensureDependencies', newModules)
            .then(function () { return _this._triggerModules('load', newModules); })
            .then(function () { return _this; });
    };
    OwInstance.prototype._triggerModules = function (event, modules) {
        var _this = this;
        if (modules === void 0) { modules = this.modules; }
        this.logger.debug("Triggering \"" + event + "\" on modules...");
        // nothing to load, exit
        var modulesToHandle = Object.keys(modules);
        if (!modulesToHandle.length)
            return Promise.resolve();
        return new Promise(function (resolve, reject) {
            if (modulesToHandle.length) {
                var triggerModule_1 = function (module) {
                    _this.logger.debug(event + ": \"" + module.name + "\"");
                    // @ts-ignore
                    var promise = (module[event] || getThenable)();
                    return (promise || getThenable())
                        .then(function () {
                        if (modulesToHandle.length) {
                            // @ts-ignore
                            triggerModule_1(modules[modulesToHandle.shift()]);
                        }
                    })
                        .catch(reject);
                };
                // @ts-ignore
                return triggerModule_1(modules[modulesToHandle.shift()])
                    .then(resolve)
                    .catch(function (err) {
                    _this.logger.error("Couldn't trigger " + event + " on modules.\r\n\r\n", err);
                    reject();
                });
            }
            return resolve();
        });
    };
    OwInstance.prototype.start = function () {
        var _this = this;
        this.logger.info(this.started ? "Restarting ow application" : "Starting ow application.");
        var before = Promise.resolve();
        if (this.started) {
            before = this._triggerModules('unload', this.modules);
        }
        return before
            .then(function () { return _this._triggerModules('ready', _this.modules); })
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
    OwInstance.prototype.stop = function () {
        process.removeListener('unhandledRejection', this.unhandledRejectionHandler);
        if (this.started) {
            return this._triggerModules('unload', this.modules);
        }
        return Promise.resolve();
    };
    return OwInstance;
}());
var noopLogger = {
    info: noop,
    log: noop,
    debug: noop,
    error: noop,
    warn: noop,
};
function unhandledRejection(logger, error) {
    logger.error(error);
}
var OwConstructor = OwInstance;
exports.default = OwConstructor;
//# sourceMappingURL=Ow.js.map