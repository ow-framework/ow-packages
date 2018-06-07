"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Module = /** @class */ (function () {
    function Module(app, config) {
        if (config === void 0) { config = {}; }
        this.name = config.name || this.constructor.name;
        this.app = app;
        return this;
    }
    return Module;
}());
exports.Module = Module;
exports.default = Module;
//# sourceMappingURL=Module.js.map