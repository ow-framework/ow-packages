"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Koa = require("koa");
var KoaRouter = require("koa-router");
var mount = require("koa-mount");
var koaStatic = require("koa-static");
var getPort = require("get-port");
var core_1 = require("@ow-framework/core");
;
/**
 * ow module which adds koa to your application.
 *
 * @class OwKoa
 * @extends OwModule
 */
var OwKoa = /** @class */ (function (_super) {
    __extends(OwKoa, _super);
    function OwKoa() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.config = {
            port: undefined,
            enableBodyParser: true,
            enableHelmet: true,
            staticFolder: './static/',
            enablePMX: false,
        };
        _this.load = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, app, config, pm2, probe, meter_1;
            return __generator(this, function (_b) {
                _a = this, app = _a.app, config = _a.config;
                console.log("wow");
                app.koa = new Koa();
                app.router = new KoaRouter();
                app.koa.proxy = true;
                if (config.enableHelmet && process.env.NODE_ENV !== 'development') {
                    app.koa.use(require('koa-helmet')());
                }
                if (config.enableBodyParser) {
                    app.koa.use(require('koa-body')());
                }
                if (config.staticFolder) {
                    app.koa.use(mount('/static', koaStatic(config.staticFolder)));
                }
                if (config.enablePMX) {
                    pm2 = require('../../helpers/pmx').default;
                    probe = pm2.probe();
                    meter_1 = probe.meter({
                        name: 'req/sec',
                        samples: 1,
                    });
                    app.koa.use(function (ctx, next) {
                        meter_1.mark();
                        return next();
                    });
                }
                return [2 /*return*/, this];
            });
        }); };
        _this.setPort = function () { return __awaiter(_this, void 0, void 0, function () {
            var config, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        config = this.config;
                        _a = this;
                        _b = parseInt;
                        _c = config.port || process.env.PORT;
                        if (_c) return [3 /*break*/, 2];
                        return [4 /*yield*/, getPort()];
                    case 1:
                        _c = (_d.sent());
                        _d.label = 2;
                    case 2:
                        _a.port = _b.apply(void 0, [(_c).toString(),
                            10]);
                        if (process.env.NODE_ENV === 'test' && process.env.TEST_PORT) {
                            this.port = parseInt(process.env.TEST_PORT, 10);
                        }
                        return [2 /*return*/, this.port];
                }
            });
        }); };
        _this.ready = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, logger, koa, router, port, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.app, logger = _a.logger, koa = _a.koa, router = _a.router;
                        router.get('/checkConnection', function (ctx) {
                            ctx.status = 200;
                            ctx.body = 'ok';
                        });
                        // attach a new $cache objcet for each request
                        koa.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        ctx.$cache = {};
                                        return [4 /*yield*/, next()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        // attach request time middleware
                        koa.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
                            var start;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        start = Date.now();
                                        return [4 /*yield*/, next()];
                                    case 1:
                                        _a.sent();
                                        logger.debug("Time: " + (Date.now() - start) + "ms");
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        koa.use(router.routes());
                        koa.use(router.allowedMethods());
                        return [4 /*yield*/, this.setPort()];
                    case 1:
                        port = _c.sent();
                        _b = this.app;
                        return [4 /*yield*/, koa.listen(port)];
                    case 2:
                        _b.server = _c.sent();
                        this.server = this.app.server;
                        this.app.uri = "http://localhost:" + port;
                        logger.info("Server listening on http://localhost:" + port);
                        process.on('exit', this.unload);
                        return [2 /*return*/, this];
                }
            });
        }); };
        _this.unload = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.app.logger.info("Closing server listening on http://localhost:" + this.port);
                        if (!this.server) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.server.close()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this];
                }
            });
        }); };
        return _this;
    }
    return OwKoa;
}(core_1.OwModule));
exports.default = OwKoa;
//# sourceMappingURL=index.js.map