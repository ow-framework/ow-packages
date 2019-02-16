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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var sinon = require("sinon");
var Application_1 = require("./Application");
var Module_1 = require("./Module");
describe('Module', function () {
    it('can be instantiated', function () {
        var app = new Application_1.default();
        var instance = new Module_1.default(app);
        expect(instance).toBeInstanceOf(Module_1.default);
    });
    it("sets it's constructors name as a member", function () {
        var app = new Application_1.default();
        var instance = new Module_1.default(app);
        expect(instance.name).toBe('Module');
    });
    it("sets its name member to passed config.name if available", function () {
        var app = new Application_1.default();
        var instance = new Module_1.default(app, { name: "Different Name" });
        expect(instance.name).toBe('Different Name');
    });
    it('can be used as base class for custom modules', function () {
        var app = new Application_1.default();
        var CustomModule = /** @class */ (function (_super) {
            __extends(CustomModule, _super);
            function CustomModule() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return CustomModule;
        }(Module_1.default));
        var instance = new CustomModule(app);
        expect(instance.name).toBe('CustomModule');
        expect(instance.app).toBe(app);
    });
    it("module instance can be added to app", function () { return __awaiter(_this, void 0, void 0, function () {
        var app, instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = new Application_1.default({ silent: true });
                    instance = new Module_1.default(app);
                    return [4 /*yield*/, app.addModules([instance])];
                case 1:
                    _a.sent();
                    expect(app.modules.Module).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it("can overwrite start function\n      which will be triggered during\n      ow application lifecycle\n      ", function () { return __awaiter(_this, void 0, void 0, function () {
        var app, start, CustomModule, instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = new Application_1.default({ silent: true });
                    start = sinon.fake.returns(new Promise(function (resolve) { return resolve(app); }));
                    CustomModule = /** @class */ (function (_super) {
                        __extends(CustomModule, _super);
                        function CustomModule() {
                            var _this = _super !== null && _super.apply(this, arguments) || this;
                            _this.start = start;
                            return _this;
                        }
                        return CustomModule;
                    }(Module_1.default));
                    instance = new CustomModule(app);
                    app.addModules([instance]);
                    expect(instance.name).toBe('CustomModule');
                    expect(start.calledOnce).toBeFalsy();
                    return [4 /*yield*/, app.start()];
                case 1:
                    _a.sent();
                    expect(start.calledOnce).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
    it("throws if dependency module does not exist", function () { return __awaiter(_this, void 0, void 0, function () {
        var app, CustomModule, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = new Application_1.default({ silent: true });
                    CustomModule = /** @class */ (function (_super) {
                        __extends(CustomModule, _super);
                        function CustomModule() {
                            var _this = _super !== null && _super.apply(this, arguments) || this;
                            _this.dependencies = ['DOES_NOT_EXIST'];
                            return _this;
                        }
                        return CustomModule;
                    }(Module_1.default));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, app.addModules([CustomModule])];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    expect(err_1).toBeTruthy();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it("does not throw if dependency module exists", function () { return __awaiter(_this, void 0, void 0, function () {
        var app, CustomModule, WithDepModule;
        return __generator(this, function (_a) {
            app = new Application_1.default({ silent: true });
            CustomModule = /** @class */ (function (_super) {
                __extends(CustomModule, _super);
                function CustomModule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CustomModule;
            }(Module_1.default));
            WithDepModule = /** @class */ (function (_super) {
                __extends(WithDepModule, _super);
                function WithDepModule() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.dependencies = ['CustomModule'];
                    return _this;
                }
                return WithDepModule;
            }(Module_1.default));
            try {
                app.addModules([CustomModule, WithDepModule]);
                expect(true).toBeTruthy();
            }
            catch (err) {
                expect(err).toBeFalsy();
            }
            return [2 /*return*/];
        });
    }); });
    it("respects order in which modules are added when ensuring dependencies", function () { return __awaiter(_this, void 0, void 0, function () {
        var app, CustomModule, WithDepModule;
        return __generator(this, function (_a) {
            app = new Application_1.default({ silent: true });
            CustomModule = /** @class */ (function (_super) {
                __extends(CustomModule, _super);
                function CustomModule() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return CustomModule;
            }(Module_1.default));
            WithDepModule = /** @class */ (function (_super) {
                __extends(WithDepModule, _super);
                function WithDepModule() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.dependencies = ['CustomModule'];
                    return _this;
                }
                return WithDepModule;
            }(Module_1.default));
            try {
                app.addModules([CustomModule, WithDepModule]);
                expect(true).toBeFalsy();
            }
            catch (err) {
                expect(err).toBeTruthy();
            }
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=Module.test.js.map