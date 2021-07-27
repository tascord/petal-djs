"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var PetalStorage_1 = require("./PetalStorage");
var PetalInteractionManager = /** @class */ (function () {
    /**
     * InteractionManager constructor
     */
    function PetalInteractionManager(opts) {
        var _this = this;
        if (opts === void 0) { opts = {}; }
        /**
         * Registers an interaction
         * @param handler
         * @param custom_id
         * @returns
         */
        this.register_interaction = function (handler, linked_user, single, custom_id) {
            var id = custom_id || _this.generate_token();
            _this.interactions[id] = {
                handler: handler,
                linked_user: linked_user,
                single: single,
                registered: Date.now()
            };
            return id;
        };
        /**
         * Handles an interaction
         * @param interaction Interaction data
         */
        this.handle_interaction = function (interaction, petal) { return __awaiter(_this, void 0, void 0, function () {
            var command, guild_1, compiled_arguments, i, v, type, data;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!interaction.isCommand()) return [3 /*break*/, 3];
                        // Defer temporarily
                        interaction.defer();
                        command = petal.modules.commands[interaction.commandName];
                        // Warn on no handler
                        if (!command) {
                            console.warn("Command '/" + interaction.commandName + "' was run, however the command file doesn't exist.");
                            interaction.deleteReply();
                        }
                        if (!interaction.guildId)
                            return [2 /*return*/];
                        return [4 /*yield*/, petal.client.guilds.fetch()];
                    case 1: return [4 /*yield*/, (_d.sent())];
                    case 2:
                        _d.sent();
                        guild_1 = petal.client.guilds.cache.get(interaction.guildId);
                        if (!guild_1)
                            return [2 /*return*/];
                        compiled_arguments = command.arguments.map(function (command_argument) {
                            var argument = interaction.options.get(command_argument.name.toLowerCase(), command_argument.required);
                            if (!argument)
                                return null;
                            if (command_argument.type === 'channel')
                                return argument.channel;
                            if (command_argument.type === 'number')
                                return argument.value;
                            if (command_argument.type === 'string')
                                return argument.value;
                            if (command_argument.type === 'role')
                                return argument.role;
                            if (command_argument.type === 'member') {
                                var user = interaction.user;
                                if (!user)
                                    return;
                                return guild_1.members.cache.get(user.id);
                            }
                        });
                        for (i = 0; i < compiled_arguments.length; i++) {
                            v = compiled_arguments[i];
                            type = (v instanceof discord_js_1.Channel) ? 'channel' :
                                (v instanceof discord_js_1.Role) ? 'role' :
                                    (v instanceof discord_js_1.GuildMember) ? 'member' :
                                        (typeof (v) === 'number') ? 'number' :
                                            'string';
                            if (command.arguments[i].type !== type) {
                                console.log(v, "Invalid argument. Required type: " + command.arguments[i].type + ". Received type: " + type);
                                return [2 /*return*/, interaction.followUp(petal.error_handler((_a = command.arguments[i].message) !== null && _a !== void 0 ? _a : "Invalid argument type provided."))];
                            }
                        }
                        // Handle command
                        command.run(petal, compiled_arguments, interaction, new PetalStorage_1.Store(petal.users, interaction.user.id), new PetalStorage_1.Store(petal.servers, ((_c = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : 'NULL').toString()))
                            .then(function (response) {
                            if (response === null)
                                return interaction.deleteReply();
                            var message_data = petal.format_command_response(interaction.commandName, response);
                            interaction.followUp(message_data);
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        if (interaction.isButton() || interaction.isSelectMenu()) {
                            if (!interaction.customId) {
                                // Handle action if un-registered
                                if (interaction.deferUpdate)
                                    interaction.deferUpdate();
                            }
                            ;
                            data = this.interactions[interaction.customId];
                            if (!data)
                                return [2 /*return*/, interaction.deferUpdate()];
                            if (data.linked_user ? data.linked_user != interaction.user.id : false)
                                return [2 /*return*/, interaction.deferUpdate()];
                            data.handler(interaction);
                            if (data.single)
                                delete this.interactions[interaction.customId];
                        }
                        _d.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Generates an unused token (custom_id)
         * @returns Unused token
         */
        this.generate_token = function () {
            var token;
            do {
                token = 'petal_xxxxxxxxxx'.replace(/x/g, function () {
                    return Math.floor(Math.random() * 11).toString();
                });
            } while (_this.interactions[token]);
            return token;
        };
        this.interactions = {};
        setInterval(function () {
            var e_1, _a;
            var _b;
            try {
                for (var _c = __values(Object.entries(_this.interactions)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = __read(_d.value, 2), key = _e[0], value = _e[1];
                    var registered = value.registered;
                    if (!registered) {
                        console.warn("No registered time for " + key + ".");
                        continue;
                    }
                    if (Date.now() - registered > ((_b = opts.cache_time) !== null && _b !== void 0 ? _b : 5 * 60 * 1000))
                        delete _this.interactions[key];
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }, 30 * 1000);
    }
    return PetalInteractionManager;
}());
exports.default = PetalInteractionManager;
//# sourceMappingURL=PetalInteractionManager.js.map