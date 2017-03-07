"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var error_1 = require("./error");
var serializer_1 = require("./serializer");
var json_1 = require("./serializers/json");
var dts_1 = require("./serializers/dts");
var UnknownMimetype = (function (_super) {
    __extends(UnknownMimetype, _super);
    function UnknownMimetype() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UnknownMimetype;
}(error_1.JsonSchemaErrorBase));
exports.UnknownMimetype = UnknownMimetype;
function createSerializerFromMimetype(mimetype, writer) {
    var opts = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        opts[_i - 2] = arguments[_i];
    }
    var Klass = null;
    switch (mimetype) {
        case 'application/json':
            Klass = json_1.JsonSerializer;
            break;
        case 'text/json':
            Klass = json_1.JsonSerializer;
            break;
        case 'text/x.typescript':
            Klass = dts_1.DTsSerializer;
            break;
        case 'text/x.dts':
            Klass = dts_1.DTsSerializer;
            break;
        default: throw new UnknownMimetype();
    }
    return new (Klass.bind.apply(Klass, [void 0, writer].concat(opts)))();
}
exports.createSerializerFromMimetype = createSerializerFromMimetype;
serializer_1.Serializer.fromMimetype = createSerializerFromMimetype;
//# sourceMappingURL=/Users/izumiwong-horiuchi/src/angular-cli/packages/@ngtools/json-schema/src/mimetypes.js.map