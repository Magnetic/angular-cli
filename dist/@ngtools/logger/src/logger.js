"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
var Logger = (function (_super) {
    __extends(Logger, _super);
    function Logger(name, parent) {
        if (parent === void 0) { parent = null; }
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.parent = parent;
        _this._subject = new Subject_1.Subject();
        var path = [];
        var p = parent;
        while (p) {
            path.push(p.name);
            p = p.parent;
        }
        _this._metadata = { name: name, path: path };
        _this._observable = _this._subject.asObservable();
        if (parent) {
            // When the parent completes, complete us as well.
            _this.parent._subject.subscribe(null, null, function () { return _this.complete(); });
        }
        return _this;
    }
    Object.defineProperty(Logger.prototype, "_observable", {
        get: function () { return this._obs; },
        set: function (v) {
            var _this = this;
            if (this._subscription) {
                this._subscription.unsubscribe();
            }
            this._obs = v;
            if (this.parent) {
                this._subscription = this.subscribe(function (value) {
                    _this.parent._subject.next(value);
                }, function (error) {
                    _this.parent._subject.error(error);
                }, function () {
                    _this._subscription.unsubscribe();
                    _this._subscription = null;
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    Logger.prototype.complete = function () {
        this._subject.complete();
    };
    Logger.prototype.log = function (level, message, metadata) {
        if (metadata === void 0) { metadata = {}; }
        var entry = Object.assign({}, this._metadata, metadata, {
            level: level, message: message, timestamp: +Date.now()
        });
        this._subject.next(entry);
    };
    Logger.prototype.debug = function (message, metadata) {
        if (metadata === void 0) { metadata = {}; }
        return this.log('debug', message, metadata);
    };
    Logger.prototype.info = function (message, metadata) {
        if (metadata === void 0) { metadata = {}; }
        return this.log('info', message, metadata);
    };
    Logger.prototype.warn = function (message, metadata) {
        if (metadata === void 0) { metadata = {}; }
        return this.log('warn', message, metadata);
    };
    Logger.prototype.error = function (message, metadata) {
        if (metadata === void 0) { metadata = {}; }
        return this.log('error', message, metadata);
    };
    Logger.prototype.fatal = function (message, metadata) {
        if (metadata === void 0) { metadata = {}; }
        return this.log('fatal', message, metadata);
    };
    Logger.prototype.toString = function () {
        return "<Logger(" + this.name + ")>";
    };
    Logger.prototype.lift = function (operator) {
        return this._observable.lift(operator);
    };
    Logger.prototype.subscribe = function (observerOrNext, error, complete) {
        return this._observable.subscribe.apply(this._observable, arguments);
    };
    Logger.prototype.forEach = function (next, PromiseCtor) {
        return this._observable.forEach(next, PromiseCtor);
    };
    return Logger;
}(Observable_1.Observable));
exports.Logger = Logger;
//# sourceMappingURL=/Users/izumiwong-horiuchi/src/angular-cli/packages/@ngtools/logger/src/logger.js.map