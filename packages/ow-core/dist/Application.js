"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("./lib");
var Application = /** @class */ (function () {
    function Application(_a) {
        var _b = (_a === void 0 ? {} : _a).silent, silent = _b === void 0 ? false : _b;
        var _this = this;
        this.env = process.env;
        this.logger = console;
        this.logLevel = process.env.LOG_LEVEL || 'info';
        this.modules = {};
        this.models = {};
        this.listeners = {
            start: [],
            stop: [],
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
        this.addModules = function (modules) {
            var self = _this;
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
            _this.modules = __assign({}, _this.modules, newModules);
            return _this;
        };
        this.triggerModules = function (event, modules) {
            if (modules === void 0) { modules = _this.modules; }
            _this.logger.debug("Triggering \"" + event + "\" on modules...");
            // nothing to load, exit
            var modulesToHandle = Object.keys(modules);
            if (!modulesToHandle.length)
                return Promise.resolve(_this);
            return new Promise(function (resolve, reject) {
                var triggerModule = function (module) {
                    _this.logger.debug(event + ": \"" + module.name + "\"");
                    // @ts-ignore
                    var promise = (module[event] || lib_1.getThenable)();
                    return (promise || lib_1.getThenable())
                        .then(function () {
                        if (modulesToHandle.length) {
                            // @ts-ignore
                            return triggerModule(modules[modulesToHandle.shift()]);
                        }
                    })
                        .catch(function (err) {
                        console.error("An error occurred when calling " + event + "\u00A0on " + module.name, err);
                        return reject(err);
                    });
                };
                // @ts-ignore
                triggerModule(modules[modulesToHandle.shift()])
                    .then(function () { return resolve(_this); })
                    .catch(function (err) {
                    _this.logger.error("Couldn't trigger " + event + " on modules.\r\n\r\n", err);
                    reject();
                });
            });
        };
        this.start = function () {
            _this.logger.info(_this.started ? "Restarting ow application" : "Starting ow application.");
            var before = !_this.started
                ? Promise.resolve(_this)
                : _this.triggerModules('stop', _this.modules);
            return before
                .then(function () { return _this.triggerModules('start', _this.modules); })
                .then(function () {
                _this.logger.info("Started ow application.");
                _this.started = true;
                return _this;
            })
                .catch(function (e) {
                _this.logger.error(e);
                _this.logger.error('An error occured during the application start sequence.\r\n' +
                    'This is probably not an issue with Ow but a module you loaded.\r\n' +
                    'There is likely more logging output above.');
                return _this;
            });
        };
        this.stop = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                process.removeListener('unhandledRejection', this.unhandledRejectionHandler);
                if (this.started) {
                    return [2 /*return*/, this.triggerModules('stop', this.modules)];
                }
                return [2 /*return*/, Promise.resolve(this)];
            });
        }); };
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
    return Application;
}());
var Ow = Application;
exports.default = Ow;
//# sourceMappingURL=Application.js.map