"use strict";
var JsonSerializer = (function () {
    function JsonSerializer(_writer, _indentDelta) {
        if (_indentDelta === void 0) { _indentDelta = 2; }
        this._writer = _writer;
        this._indentDelta = _indentDelta;
        this._state = [];
    }
    JsonSerializer.prototype._willOutputValue = function () {
        if (this._state.length > 0) {
            var top_1 = this._top();
            var wasEmpty = top_1.empty;
            top_1.empty = false;
            if (!wasEmpty && !top_1.property) {
                this._writer(',');
            }
            if (!top_1.property) {
                this._indent();
            }
        }
    };
    JsonSerializer.prototype._top = function () {
        return this._state[this._state.length - 1] || {};
    };
    JsonSerializer.prototype._indent = function () {
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
    JsonSerializer.prototype.start = function () { };
    JsonSerializer.prototype.end = function () {
        if (this._indentDelta) {
            this._writer('\n');
        }
    };
    JsonSerializer.prototype.object = function (node) {
        if (node.defined == false) {
            return;
        }
        this._willOutputValue();
        this._writer('{');
        this._state.push({ empty: true, type: 'object' });
        for (var _i = 0, _a = Object.keys(node.children); _i < _a.length; _i++) {
            var key = _a[_i];
            this.property(node.children[key]);
        }
        // Fallback to direct value output for additional properties.
        if (!node.frozen) {
            for (var _b = 0, _c = Object.keys(node.value); _b < _c.length; _b++) {
                var key = _c[_b];
                if (key in node.children) {
                    continue;
                }
                this._willOutputValue();
                this._writer(JSON.stringify(key));
                this._writer(': ');
                this._writer(JSON.stringify(node.value[key]));
            }
        }
        this._state.pop();
        if (!this._top().empty) {
            this._indent();
        }
        this._writer('}');
    };
    JsonSerializer.prototype.property = function (node) {
        if (node.defined == false) {
            return;
        }
        this._willOutputValue();
        this._writer(JSON.stringify(node.name));
        this._writer(': ');
        this._top().property = true;
        node.serialize(this);
        this._top().property = false;
    };
    JsonSerializer.prototype.array = function (node) {
        if (node.defined == false) {
            return;
        }
        this._willOutputValue();
        this._writer('[');
        this._state.push({ empty: true, type: 'array' });
        for (var i = 0; i < node.items.length; i++) {
            node.items[i].serialize(this);
        }
        this._state.pop();
        if (!this._top().empty) {
            this._indent();
        }
        this._writer(']');
    };
    JsonSerializer.prototype.outputOneOf = function (node) {
        this.outputValue(node);
    };
    JsonSerializer.prototype.outputValue = function (node) {
        this._willOutputValue();
        this._writer(JSON.stringify(node.value, null, this._indentDelta));
    };
    JsonSerializer.prototype.outputString = function (node) {
        this._willOutputValue();
        this._writer(JSON.stringify(node.value));
    };
    JsonSerializer.prototype.outputNumber = function (node) {
        this._willOutputValue();
        this._writer(JSON.stringify(node.value));
    };
    JsonSerializer.prototype.outputInteger = function (node) {
        this._willOutputValue();
        this._writer(JSON.stringify(node.value));
    };
    JsonSerializer.prototype.outputBoolean = function (node) {
        this._willOutputValue();
        this._writer(JSON.stringify(node.value));
    };
    return JsonSerializer;
}());
exports.JsonSerializer = JsonSerializer;
//# sourceMappingURL=/Users/izumiwong-horiuchi/src/angular-cli/packages/@ngtools/json-schema/src/serializers/json.js.map