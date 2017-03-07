"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var logger_1 = require("./logger");
require("rxjs/add/operator/map");
/**
 * Keep an map of indentation => array of indentations based on the level.
 * This is to optimize calculating the prefix based on the indentation itself. Since most logs
 * come from similar levels, and with similar indentation strings, this will be shared by all
 * loggers. Also, string concatenation is expensive so performing concats for every log entries
 * is expensive; this alleviates it.
 */
var indentationMap = {};
var IndentLogger = (function (_super) {
    __extends(IndentLogger, _super);
    function IndentLogger(name, parent, indentation) {
        if (parent === void 0) { parent = null; }
        if (indentation === void 0) { indentation = '  '; }
        var _this = _super.call(this, name, parent) || this;
        indentationMap[indentation] = indentationMap[indentation] || [''];
        var map = indentationMap[indentation];
        _this._observable = _this._observable.map(function (entry) {
            var l = entry.path.length;
            if (l >= map.length) {
                var current = map[map.length - 1];
                while (l >= map.length) {
                    current += indentation;
                    map.push(current);
                }
            }
            entry.message = map[l] + entry.message;
            return entry;
        });
        return _this;
    }
    return IndentLogger;
}(logger_1.Logger));
exports.IndentLogger = IndentLogger;
//# sourceMappingURL=/Users/izumiwong-horiuchi/src/angular-cli/packages/@ngtools/logger/src/indent.js.map