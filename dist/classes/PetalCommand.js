"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var PetalCommand = /** @class */ (function () {
    /**
     * Petal command constructor
     * @param opts Petal command data
     * @example new PetalCommand()
     */
    function PetalCommand(opts) {
        var e_1, _a;
        if (opts === void 0) { opts = {}; }
        var _b, _c, _d, _e, _f, _g, _h;
        if (!opts)
            throw new TypeError("No command opts provided.");
        this.description = (_b = opts.description) !== null && _b !== void 0 ? _b : (opts.description = 'No description.');
        this.example = (_c = opts.example) !== null && _c !== void 0 ? _c : (opts.example = 'No example.');
        this.group = (_d = opts.group) !== null && _d !== void 0 ? _d : (opts.group = 'Un-grouped');
        this.arguments = (_e = opts.arguments) !== null && _e !== void 0 ? _e : (opts.arguments = []);
        this.runas = (_f = opts.runas) !== null && _f !== void 0 ? _f : (opts.runas = []);
        this.alias = (_g = opts.alias) !== null && _g !== void 0 ? _g : (opts.alias = []);
        this.delete = (_h = opts.delete) !== null && _h !== void 0 ? _h : (opts.delete = true);
        try {
            for (var _j = __values(this.arguments), _k = _j.next(); !_k.done; _k = _j.next()) {
                var argument = _k.value;
                if (argument.list && (argument.type !== 'string' && argument.type !== 'number'))
                    throw new TypeError("Cannot have list items and a non string nor numerical value");
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_k && !_k.done && (_a = _j.return)) _a.call(_j);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    /**
     * Command run function
     * @param petal Petal instance
     * @param args Message arguments
     * @param message Message object
     * @param user_data user data store
     * @param server_data server data store
     */
    PetalCommand.prototype.run = function (petal, args, message, user_data, server_data) { return Promise.resolve(null); };
    return PetalCommand;
}());
exports.default = PetalCommand;
//# sourceMappingURL=PetalCommand.js.map