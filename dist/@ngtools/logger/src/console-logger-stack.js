"use strict";
var logger_1 = require("./logger");
var globalConsoleStack = null;
var originalConsoleDebug;
var originalConsoleLog;
var originalConsoleWarn;
var originalConsoleError;
function _push(logger) {
    if (globalConsoleStack.length == 0) {
        originalConsoleDebug = console.debug;
        originalConsoleLog = console.log;
        originalConsoleWarn = console.warn;
        originalConsoleError = console.error;
        console.debug = function (msg) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            globalConsoleStack[globalConsoleStack.length - 1].debug(msg, { args: args });
        };
        console.log = function (msg) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            globalConsoleStack[globalConsoleStack.length - 1].info(msg, { args: args });
        };
        console.warn = function (msg) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            globalConsoleStack[globalConsoleStack.length - 1].warn(msg, { args: args });
        };
        console.error = function (msg) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            globalConsoleStack[globalConsoleStack.length - 1].error(msg, { args: args });
        };
    }
    globalConsoleStack.push(logger);
    return logger;
}
function _pop() {
    globalConsoleStack[globalConsoleStack.length - 1].complete();
    globalConsoleStack.pop();
    if (globalConsoleStack.length == 0) {
        console.log = originalConsoleLog;
        console.warn = originalConsoleWarn;
        console.error = originalConsoleError;
        console.debug = originalConsoleDebug;
        globalConsoleStack = null;
    }
}
var ConsoleLoggerStack = (function () {
    function ConsoleLoggerStack() {
    }
    ConsoleLoggerStack.push = function (nameOrLogger) {
        if (nameOrLogger === void 0) { nameOrLogger = ''; }
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (typeof nameOrLogger == 'string') {
            return _push(new logger_1.Logger(nameOrLogger, this.top()));
        }
        else if (nameOrLogger instanceof logger_1.Logger) {
            var logger = nameOrLogger;
            if (logger.parent !== this.top()) {
                throw new Error('Pushing a logger that is not a direct child of the top of the stack.');
            }
            return _push(logger);
        }
        else {
            var klass = nameOrLogger;
            return _push(new (klass.bind.apply(klass, [void 0].concat(args, [this.top()])))());
        }
    };
    ConsoleLoggerStack.pop = function () {
        _pop();
        return this.top();
    };
    ConsoleLoggerStack.top = function () {
        return globalConsoleStack && globalConsoleStack[globalConsoleStack.length - 1];
    };
    ConsoleLoggerStack.start = function (nameOrLogger) {
        if (nameOrLogger === void 0) { nameOrLogger = ''; }
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (globalConsoleStack !== null) {
            throw new Error('Cannot start a new console logger stack while one is already going.');
        }
        globalConsoleStack = [];
        if (typeof nameOrLogger == 'string') {
            return _push(new logger_1.Logger(nameOrLogger, this.top()));
        }
        else if (nameOrLogger instanceof logger_1.Logger) {
            return _push(nameOrLogger);
        }
        else {
            var klass = nameOrLogger;
            return _push(new (klass.bind.apply(klass, [void 0].concat(args, [this.top()])))());
        }
    };
    ConsoleLoggerStack.end = function () {
        while (globalConsoleStack !== null) {
            this.pop();
        }
    };
    return ConsoleLoggerStack;
}());
exports.ConsoleLoggerStack = ConsoleLoggerStack;
//# sourceMappingURL=/Users/izumiwong-horiuchi/src/angular-cli/packages/@ngtools/logger/src/console-logger-stack.js.map