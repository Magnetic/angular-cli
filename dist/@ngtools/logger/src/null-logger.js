"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var logger_1 = require("./logger");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/observable/empty");
var NullLogger = (function (_super) {
    __extends(NullLogger, _super);
    function NullLogger(parent) {
        if (parent === void 0) { parent = null; }
        var _this = _super.call(this, '', parent) || this;
        _this._observable = Observable_1.Observable.empty();
        return _this;
    }
    return NullLogger;
}(logger_1.Logger));
exports.NullLogger = NullLogger;
//# sourceMappingURL=/Users/izumiwong-horiuchi/src/angular-cli/packages/@ngtools/logger/src/null-logger.js.map