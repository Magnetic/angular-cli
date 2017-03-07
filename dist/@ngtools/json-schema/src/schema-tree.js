"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var error_1 = require("./error");
var InvalidSchema = (function (_super) {
    __extends(InvalidSchema, _super);
    function InvalidSchema() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidSchema;
}(error_1.JsonSchemaErrorBase));
exports.InvalidSchema = InvalidSchema;
var InvalidValueError = (function (_super) {
    __extends(InvalidValueError, _super);
    function InvalidValueError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidValueError;
}(error_1.JsonSchemaErrorBase));
exports.InvalidValueError = InvalidValueError;
var MissingImplementationError = (function (_super) {
    __extends(MissingImplementationError, _super);
    function MissingImplementationError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MissingImplementationError;
}(error_1.JsonSchemaErrorBase));
exports.MissingImplementationError = MissingImplementationError;
var SettingReadOnlyPropertyError = (function (_super) {
    __extends(SettingReadOnlyPropertyError, _super);
    function SettingReadOnlyPropertyError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SettingReadOnlyPropertyError;
}(error_1.JsonSchemaErrorBase));
exports.SettingReadOnlyPropertyError = SettingReadOnlyPropertyError;
/**
 * Holds all the information, including the value, of a node in the schema tree.
 */
var SchemaTreeNode = (function () {
    function SchemaTreeNode(nodeMetaData) {
        this._defined = false;
        this._dirty = false;
        this._schema = nodeMetaData.schema;
        this._name = nodeMetaData.name;
        this._value = nodeMetaData.value;
        this._forward = nodeMetaData.forward;
        this._parent = nodeMetaData.parent;
    }
    SchemaTreeNode.prototype.dispose = function () {
        this._parent = null;
        this._schema = null;
        this._value = null;
        if (this._forward) {
            this._forward.dispose();
        }
        this._forward = null;
    };
    Object.defineProperty(SchemaTreeNode.prototype, "defined", {
        get: function () { return this._defined; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SchemaTreeNode.prototype, "dirty", {
        get: function () { return this._dirty; },
        set: function (v) {
            if (v) {
                this._defined = true;
                this._dirty = true;
                if (this._parent) {
                    this._parent.dirty = true;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SchemaTreeNode.prototype, "value", {
        get: function () { return this.get(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SchemaTreeNode.prototype, "name", {
        get: function () { return this._name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SchemaTreeNode.prototype, "readOnly", {
        get: function () { return this._schema['readOnly']; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SchemaTreeNode.prototype, "frozen", {
        get: function () { return true; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SchemaTreeNode.prototype, "description", {
        get: function () {
            return 'description' in this._schema ? this._schema['description'] : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SchemaTreeNode.prototype, "required", {
        get: function () {
            if (!this._parent) {
                return false;
            }
            return this._parent.isChildRequired(this.name);
        },
        enumerable: true,
        configurable: true
    });
    SchemaTreeNode.prototype.isChildRequired = function (name) { return false; };
    Object.defineProperty(SchemaTreeNode.prototype, "parent", {
        get: function () { return this._parent; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SchemaTreeNode.prototype, "children", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SchemaTreeNode.prototype, "items", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SchemaTreeNode.prototype, "itemPrototype", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    SchemaTreeNode.prototype.set = function (v, force) {
        if (force === void 0) { force = false; }
        if (!this.readOnly) {
            throw new MissingImplementationError();
        }
        throw new SettingReadOnlyPropertyError();
    };
    ;
    SchemaTreeNode.prototype.isCompatible = function (v) { return false; };
    SchemaTreeNode._defineProperty = function (proto, treeNode) {
        if (treeNode.readOnly) {
            Object.defineProperty(proto, treeNode.name, {
                enumerable: true,
                get: function () { return treeNode.get(); }
            });
        }
        else {
            Object.defineProperty(proto, treeNode.name, {
                enumerable: true,
                get: function () { return treeNode.get(); },
                set: function (v) { return treeNode.set(v); }
            });
        }
    };
    return SchemaTreeNode;
}());
exports.SchemaTreeNode = SchemaTreeNode;
/** Base Class used for Non-Leaves TreeNode. Meaning they can have children. */
var NonLeafSchemaTreeNode = (function (_super) {
    __extends(NonLeafSchemaTreeNode, _super);
    function NonLeafSchemaTreeNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NonLeafSchemaTreeNode.prototype.dispose = function () {
        for (var _i = 0, _a = Object.keys(this.children || {}); _i < _a.length; _i++) {
            var key = _a[_i];
            this.children[key].dispose();
        }
        for (var _b = 0, _c = this.items || []; _b < _c.length; _b++) {
            var item = _c[_b];
            item.dispose();
        }
        _super.prototype.dispose.call(this);
    };
    NonLeafSchemaTreeNode.prototype.get = function () {
        if (this.defined) {
            return this._value;
        }
        else {
            return undefined;
        }
    };
    NonLeafSchemaTreeNode.prototype.destroy = function () {
        this._defined = false;
        this._value = null;
    };
    // Helper function to create a child based on its schema.
    NonLeafSchemaTreeNode.prototype._createChildProperty = function (name, value, forward, schema, define) {
        if (define === void 0) { define = true; }
        var type = ('oneOf' in schema) ? 'oneOf' :
            ('enum' in schema) ? 'enum' : schema['type'];
        var Klass = null;
        switch (type) {
            case 'object':
                Klass = ObjectSchemaTreeNode;
                break;
            case 'array':
                Klass = ArraySchemaTreeNode;
                break;
            case 'string':
                Klass = StringSchemaTreeNode;
                break;
            case 'boolean':
                Klass = BooleanSchemaTreeNode;
                break;
            case 'number':
                Klass = NumberSchemaTreeNode;
                break;
            case 'integer':
                Klass = IntegerSchemaTreeNode;
                break;
            case 'enum':
                Klass = EnumSchemaTreeNode;
                break;
            case 'oneOf':
                Klass = OneOfSchemaTreeNode;
                break;
            default:
                throw new InvalidSchema('Type ' + type + ' not understood by SchemaClassFactory.');
        }
        var metaData = new Klass({ parent: this, forward: forward, value: value, schema: schema, name: name });
        if (define) {
            SchemaTreeNode._defineProperty(this._value, metaData);
        }
        return metaData;
    };
    return NonLeafSchemaTreeNode;
}(SchemaTreeNode));
exports.NonLeafSchemaTreeNode = NonLeafSchemaTreeNode;
var OneOfSchemaTreeNode = (function (_super) {
    __extends(OneOfSchemaTreeNode, _super);
    function OneOfSchemaTreeNode(metaData) {
        var _this = _super.call(this, metaData) || this;
        var value = metaData.value, forward = metaData.forward, schema = metaData.schema;
        _this._typesPrototype = schema['oneOf'].map(function (schema) {
            return _this._createChildProperty('', '', forward, schema, false);
        });
        _this._currentTypeHolder = null;
        _this._set(value, true, false);
        return _this;
    }
    OneOfSchemaTreeNode.prototype._set = function (v, init, force) {
        if (!init && this.readOnly && !force) {
            throw new SettingReadOnlyPropertyError();
        }
        // Find the first type prototype that is compatible with the
        var proto = null;
        for (var i = 0; i < this._typesPrototype.length; i++) {
            var p = this._typesPrototype[i];
            if (p.isCompatible(v)) {
                proto = p;
                break;
            }
        }
        if (proto == null) {
            return;
        }
        if (!init) {
            this.dirty = true;
        }
        this._currentTypeHolder = proto;
        this._currentTypeHolder.set(v, true);
    };
    OneOfSchemaTreeNode.prototype.set = function (v, force) {
        if (force === void 0) { force = false; }
        return this._set(v, false, force);
    };
    OneOfSchemaTreeNode.prototype.get = function () {
        return this._currentTypeHolder ? this._currentTypeHolder.get() : null;
    };
    Object.defineProperty(OneOfSchemaTreeNode.prototype, "defaultValue", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OneOfSchemaTreeNode.prototype, "defined", {
        get: function () { return this._currentTypeHolder ? this._currentTypeHolder.defined : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OneOfSchemaTreeNode.prototype, "items", {
        get: function () { return this._typesPrototype; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OneOfSchemaTreeNode.prototype, "type", {
        get: function () { return 'oneOf'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OneOfSchemaTreeNode.prototype, "tsType", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    OneOfSchemaTreeNode.prototype.serialize = function (serializer) { serializer.outputOneOf(this); };
    return OneOfSchemaTreeNode;
}(NonLeafSchemaTreeNode));
exports.OneOfSchemaTreeNode = OneOfSchemaTreeNode;
/** A Schema Tree Node that represents an object. */
var ObjectSchemaTreeNode = (function (_super) {
    __extends(ObjectSchemaTreeNode, _super);
    function ObjectSchemaTreeNode(metaData) {
        var _this = _super.call(this, metaData) || this;
        _this._frozen = false;
        _this._set(metaData.value, true, false);
        return _this;
    }
    ObjectSchemaTreeNode.prototype._set = function (value, init, force) {
        if (!init && this.readOnly && !force) {
            throw new SettingReadOnlyPropertyError();
        }
        var schema = this._schema;
        var forward = this._forward;
        this._defined = !!value;
        this._children = Object.create(null);
        this._value = Object.create(null);
        this._dirty = this._dirty || !init;
        if (schema['properties']) {
            for (var _i = 0, _a = Object.keys(schema['properties']); _i < _a.length; _i++) {
                var name_1 = _a[_i];
                var propertySchema = schema['properties'][name_1];
                this._children[name_1] = this._createChildProperty(name_1, value ? value[name_1] : null, forward ? forward.children[name_1] : null, propertySchema);
            }
        }
        else if (!schema['additionalProperties']) {
            throw new InvalidSchema('Schema does not have a properties, but doesnt allow for '
                + 'additional properties.');
        }
        if (!schema['additionalProperties']) {
            this._frozen = true;
            Object.freeze(this._value);
            Object.freeze(this._children);
        }
        else if (value) {
            // Set other properties which don't have a schema.
            for (var _b = 0, _c = Object.keys(value); _b < _c.length; _b++) {
                var key = _c[_b];
                if (!this._children[key]) {
                    this._value[key] = value[key];
                }
            }
        }
    };
    ObjectSchemaTreeNode.prototype.set = function (v, force) {
        if (force === void 0) { force = false; }
        return this._set(v, false, force);
    };
    Object.defineProperty(ObjectSchemaTreeNode.prototype, "frozen", {
        get: function () { return this._frozen; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectSchemaTreeNode.prototype, "children", {
        get: function () { return this._children; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectSchemaTreeNode.prototype, "type", {
        get: function () { return 'object'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectSchemaTreeNode.prototype, "tsType", {
        get: function () { return Object; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObjectSchemaTreeNode.prototype, "defaultValue", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    ObjectSchemaTreeNode.prototype.isCompatible = function (v) { return typeof v == 'object' && v !== null; };
    ObjectSchemaTreeNode.prototype.isChildRequired = function (name) {
        if (this._schema['required']) {
            return this._schema['required'].indexOf(name) != -1;
        }
        return false;
    };
    ObjectSchemaTreeNode.prototype.serialize = function (serializer) { serializer.object(this); };
    return ObjectSchemaTreeNode;
}(NonLeafSchemaTreeNode));
exports.ObjectSchemaTreeNode = ObjectSchemaTreeNode;
/** A Schema Tree Node that represents an array. */
var ArraySchemaTreeNode = (function (_super) {
    __extends(ArraySchemaTreeNode, _super);
    function ArraySchemaTreeNode(metaData) {
        var _this = _super.call(this, metaData) || this;
        _this._set(metaData.value, true, false);
        // Keep the item's schema as a schema node. This is important to keep type information.
        _this._itemPrototype = _this._createChildProperty('', null, null, metaData.schema['items'], false);
        return _this;
    }
    ArraySchemaTreeNode.prototype._set = function (value, init, force) {
        var schema = this._schema;
        var forward = this._forward;
        this._defined = !!value;
        this._value = Object.create(null);
        this._dirty = this._dirty || !init;
        if (value) {
            this._defined = true;
        }
        else {
            this._defined = false;
            value = [];
        }
        this._items = [];
        this._value = [];
        for (var index = 0; index < value.length; index++) {
            this._items[index] = this._createChildProperty('' + index, value && value[index], forward && forward.items[index], schema['items']);
        }
    };
    ArraySchemaTreeNode.prototype.set = function (v, force) {
        if (force === void 0) { force = false; }
        return this._set(v, false, force);
    };
    ArraySchemaTreeNode.prototype.isCompatible = function (v) { return Array.isArray(v); };
    Object.defineProperty(ArraySchemaTreeNode.prototype, "type", {
        get: function () { return 'array'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArraySchemaTreeNode.prototype, "tsType", {
        get: function () { return Array; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArraySchemaTreeNode.prototype, "items", {
        get: function () { return this._items; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArraySchemaTreeNode.prototype, "itemPrototype", {
        get: function () { return this._itemPrototype; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArraySchemaTreeNode.prototype, "defaultValue", {
        get: function () { return null; },
        enumerable: true,
        configurable: true
    });
    ArraySchemaTreeNode.prototype.serialize = function (serializer) { serializer.array(this); };
    return ArraySchemaTreeNode;
}(NonLeafSchemaTreeNode));
exports.ArraySchemaTreeNode = ArraySchemaTreeNode;
/**
 * The root class of the tree node. Receives a prototype that will be filled with the
 * properties of the Schema root.
 */
var RootSchemaTreeNode = (function (_super) {
    __extends(RootSchemaTreeNode, _super);
    function RootSchemaTreeNode(proto, metaData) {
        var _this = _super.call(this, metaData) || this;
        for (var _i = 0, _a = Object.keys(_this._children); _i < _a.length; _i++) {
            var key = _a[_i];
            if (_this._children[key]) {
                SchemaTreeNode._defineProperty(proto, _this._children[key]);
            }
        }
        return _this;
    }
    return RootSchemaTreeNode;
}(ObjectSchemaTreeNode));
exports.RootSchemaTreeNode = RootSchemaTreeNode;
/** A leaf in the schema tree. Must contain a single primitive value. */
var LeafSchemaTreeNode = (function (_super) {
    __extends(LeafSchemaTreeNode, _super);
    function LeafSchemaTreeNode(metaData) {
        var _this = _super.call(this, metaData) || this;
        _this._defined = !(metaData.value === undefined || metaData.value === null);
        if ('default' in metaData.schema) {
            _this._default = _this.convert(metaData.schema['default']);
        }
        return _this;
    }
    LeafSchemaTreeNode.prototype.get = function () {
        if (!this.defined && this._forward) {
            return this._forward.get();
        }
        if (!this.defined && this._default !== undefined) {
            return this._default;
        }
        return this._value === undefined ? undefined : this.convert(this._value);
    };
    LeafSchemaTreeNode.prototype.set = function (v, force) {
        if (force === void 0) { force = false; }
        if (this.readOnly && !force) {
            throw new SettingReadOnlyPropertyError();
        }
        var convertedValue = this.convert(v);
        if (convertedValue === null || convertedValue === undefined) {
            if (this.required) {
                throw new InvalidValueError("Invalid value \"" + v + "\" on a required field.");
            }
        }
        this.dirty = true;
        this._value = convertedValue;
    };
    LeafSchemaTreeNode.prototype.destroy = function () {
        this._defined = false;
        this._value = null;
    };
    Object.defineProperty(LeafSchemaTreeNode.prototype, "defaultValue", {
        get: function () {
            return 'default' in this._schema ? this._default : null;
        },
        enumerable: true,
        configurable: true
    });
    LeafSchemaTreeNode.prototype.serialize = function (serializer) {
        serializer.outputValue(this);
    };
    return LeafSchemaTreeNode;
}(SchemaTreeNode));
exports.LeafSchemaTreeNode = LeafSchemaTreeNode;
/** Basic primitives for JSON Schema. */
var StringSchemaTreeNode = (function (_super) {
    __extends(StringSchemaTreeNode, _super);
    function StringSchemaTreeNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StringSchemaTreeNode.prototype.serialize = function (serializer) { serializer.outputString(this); };
    StringSchemaTreeNode.prototype.isCompatible = function (v) { return typeof v == 'string' || v instanceof String; };
    StringSchemaTreeNode.prototype.convert = function (v) { return v === undefined ? undefined : '' + v; };
    Object.defineProperty(StringSchemaTreeNode.prototype, "type", {
        get: function () { return 'string'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StringSchemaTreeNode.prototype, "tsType", {
        get: function () { return String; },
        enumerable: true,
        configurable: true
    });
    return StringSchemaTreeNode;
}(LeafSchemaTreeNode));
var EnumSchemaTreeNode = (function (_super) {
    __extends(EnumSchemaTreeNode, _super);
    function EnumSchemaTreeNode(metaData) {
        var _this = _super.call(this, metaData) || this;
        if (!Array.isArray(metaData.schema['enum'])) {
            throw new InvalidSchema();
        }
        _this._enumValues = [].concat(metaData.schema['enum']);
        _this.set(metaData.value, true);
        return _this;
    }
    EnumSchemaTreeNode.prototype._isInEnum = function (value) {
        return this._enumValues.some(function (v) { return v === value; });
    };
    EnumSchemaTreeNode.prototype.isCompatible = function (v) {
        return (typeof v == 'string' || v instanceof String) && this._isInEnum('' + v);
    };
    EnumSchemaTreeNode.prototype.convert = function (v) {
        if (v === undefined) {
            return undefined;
        }
        if (v === null || !this._isInEnum('' + v)) {
            return null;
        }
        return '' + v;
    };
    return EnumSchemaTreeNode;
}(StringSchemaTreeNode));
var BooleanSchemaTreeNode = (function (_super) {
    __extends(BooleanSchemaTreeNode, _super);
    function BooleanSchemaTreeNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BooleanSchemaTreeNode.prototype.serialize = function (serializer) { serializer.outputBoolean(this); };
    BooleanSchemaTreeNode.prototype.isCompatible = function (v) { return typeof v == 'boolean' || v instanceof Boolean; };
    BooleanSchemaTreeNode.prototype.convert = function (v) { return v === undefined ? undefined : !!v; };
    Object.defineProperty(BooleanSchemaTreeNode.prototype, "type", {
        get: function () { return 'boolean'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BooleanSchemaTreeNode.prototype, "tsType", {
        get: function () { return Boolean; },
        enumerable: true,
        configurable: true
    });
    return BooleanSchemaTreeNode;
}(LeafSchemaTreeNode));
var NumberSchemaTreeNode = (function (_super) {
    __extends(NumberSchemaTreeNode, _super);
    function NumberSchemaTreeNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberSchemaTreeNode.prototype.serialize = function (serializer) { serializer.outputNumber(this); };
    NumberSchemaTreeNode.prototype.isCompatible = function (v) { return typeof v == 'number' || v instanceof Number; };
    NumberSchemaTreeNode.prototype.convert = function (v) { return v === undefined ? undefined : +v; };
    Object.defineProperty(NumberSchemaTreeNode.prototype, "type", {
        get: function () { return 'number'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumberSchemaTreeNode.prototype, "tsType", {
        get: function () { return Number; },
        enumerable: true,
        configurable: true
    });
    return NumberSchemaTreeNode;
}(LeafSchemaTreeNode));
var IntegerSchemaTreeNode = (function (_super) {
    __extends(IntegerSchemaTreeNode, _super);
    function IntegerSchemaTreeNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntegerSchemaTreeNode.prototype.convert = function (v) { return v === undefined ? undefined : Math.floor(+v); };
    return IntegerSchemaTreeNode;
}(NumberSchemaTreeNode));
//# sourceMappingURL=/Users/izumiwong-horiuchi/src/angular-cli/packages/@ngtools/json-schema/src/schema-tree.js.map