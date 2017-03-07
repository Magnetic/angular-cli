"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var NgToolkitError = (function (_super) {
    __extends(NgToolkitError, _super);
    function NgToolkitError(message) {
        var _this = _super.call(this) || this;
        if (message) {
            _this.message = message;
        }
        else {
            _this.message = _this.constructor.name;
        }
        return _this;
    }
    return NgToolkitError;
}(Error));
exports.NgToolkitError = NgToolkitError;
//# sourceMappingURL=/Users/izumiwong-horiuchi/src/angular-cli/packages/angular-cli/models/error.js.map