"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var logger_1 = require("./logger");
var TransformLogger = (function (_super) {
    __extends(TransformLogger, _super);
    function TransformLogger(name, transform, parent) {
        if (parent === void 0) { parent = null; }
        var _this = _super.call(this, name, parent) || this;
        _this._observable = transform(_this._observable);
        return _this;
    }
    return TransformLogger;
}(logger_1.Logger));
exports.TransformLogger = TransformLogger;
//# sourceMappingURL=/Users/izumiwong-horiuchi/src/angular-cli/packages/@ngtools/logger/src/transform-logger.js.map