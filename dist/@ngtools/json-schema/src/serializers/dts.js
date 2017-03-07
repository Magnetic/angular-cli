"use strict";
var serializer_1 = require("../serializer");
var DTsSerializer = (function () {
    function DTsSerializer(_writer, interfaceName, _indentDelta) {
        if (_indentDelta === void 0) { _indentDelta = 4; }
        this._writer = _writer;
        this.interfaceName = interfaceName;
        this._indentDelta = _indentDelta;
        this._state = [];
        if (interfaceName) {
            _writer("export interface " + interfaceName + " ");
        }
        else {
            _writer('export default interface ');
        }
    }
    DTsSerializer.prototype._willOutputValue = function () {
        if (this._state.length > 0) {
            var top_1 = this._top();
            top_1.empty = false;
            if (!top_1.property) {
                this._indent();
            }
        }
    };
    DTsSerializer.prototype._top = function () {
        return this._state[this._state.length - 1] || {};
    };
    DTsSerializer.prototype._indent = function () {
        if (this._indentDelta == 0) {
            return;
        }
        var str = '\n';
        var i = this._state.length * this._indentDelta;
        while (i--) {
            str += ' ';
        }
        this._writer(str);
    };
    DTsSerializer.prototype.start = function () { };
    DTsSerializer.prototype.end = function () {
        if (this._indentDelta) {
            this._writer('\n');
        }
    };
    DTsSerializer.prototype.object = function (node) {
        this._willOutputValue();
        this._writer('{');
        this._state.push({ empty: true, type: 'object' });
        for (var _i = 0, _a = Object.keys(node.children); _i < _a.length; _i++) {
            var key = _a[_i];
            this.property(node.children[key]);
        }
        // Fallback to direct value output for additional properties.
        if (!node.frozen) {
            this._indent();
            this._writer('[name: string]: any;');
        }
        this._state.pop();
        if (!this._top().empty) {
            this._indent();
        }
        this._writer('}');
    };
    DTsSerializer.prototype.property = function (node) {
        var _this = this;
        this._willOutputValue();
        if (node.description) {
            this._writer('/**');
            this._indent();
            node.description.split('\n').forEach(function (line) {
                _this._writer(' * ' + line);
                _this._indent();
            });
            this._writer(' */');
            this._indent();
        }
        this._writer(node.name);
        if (!node.required) {
            this._writer('?');
        }
        this._writer(': ');
        this._top().property = true;
        node.serialize(this);
        this._top().property = false;
        this._writer(';');
    };
    DTsSerializer.prototype.array = function (node) {
        this._willOutputValue();
        node.itemPrototype.serialize(this);
        this._writer('[]');
    };
    DTsSerializer.prototype.outputOneOf = function (node) {
        this._willOutputValue();
        if (!node.items) {
            throw new serializer_1.InvalidStateError();
        }
        this._writer('(');
        for (var i = 0; i < node.items.length; i++) {
            node.items[i].serialize(this);
            if (i != node.items.length - 1) {
                this._writer(' | ');
            }
        }
        this._writer(')');
    };
    DTsSerializer.prototype.outputValue = function (node) {
        this._willOutputValue();
        this._writer('any');
    };
    DTsSerializer.prototype.outputString = function (node) {
        this._willOutputValue();
        this._writer('string');
    };
    DTsSerializer.prototype.outputNumber = function (node) {
        this._willOutputValue();
        this._writer('number');
    };
    DTsSerializer.prototype.outputInteger = function (node) {
        this._willOutputValue();
        this._writer('number');
    };
    DTsSerializer.prototype.outputBoolean = function (node) {
        this._willOutputValue();
        this._writer('boolean');
    };
    return DTsSerializer;
}());
exports.DTsSerializer = DTsSerializer;
//# sourceMappingURL=/Users/izumiwong-horiuchi/src/angular-cli/packages/@ngtools/json-schema/src/serializers/dts.js.map