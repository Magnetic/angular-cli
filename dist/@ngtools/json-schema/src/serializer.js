"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var error_1 = require("./error");
var InvalidStateError = (function (_super) {
    __extends(InvalidStateError, _super);
    function InvalidStateError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidStateError;
}(error_1.JsonSchemaErrorBase));
exports.InvalidStateError = InvalidStateError;
var Serializer = (function () {
    function Serializer() {
    }
    return Serializer;
}());
exports.Serializer = Serializer;
//# sourceMappingURL=/Users/izumiwong-horiuchi/src/angular-cli/packages/@ngtools/json-schema/src/serializer.js.map