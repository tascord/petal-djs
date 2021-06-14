"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PetalCommand = /** @class */ (function () {
    /**
     * Petal command constructor
     * @param opts Petal command data
     * @example new PetalCommand({ })
     */
    function PetalCommand(opts) {
        var _a, _b, _c, _d, _e, _f, _g;
        if (!opts)
            throw new TypeError("No command opts provided.");
        this.description = (_a = opts.description) !== null && _a !== void 0 ? _a : (opts.description = 'No description.');
        this.example = (_b = opts.example) !== null && _b !== void 0 ? _b : (opts.example = 'No example.');
        this.group = (_c = opts.group) !== null && _c !== void 0 ? _c : (opts.group = 'Un-grouped');
        this.arguments = (_d = opts.arguments) !== null && _d !== void 0 ? _d : (opts.arguments = []);
        this.runas = (_e = opts.runas) !== null && _e !== void 0 ? _e : (opts.runas = []);
        this.alias = (_f = opts.alias) !== null && _f !== void 0 ? _f : (opts.alias = []);
        this.delete = (_g = opts.delete) !== null && _g !== void 0 ? _g : (opts.delete = true);
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