"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var fs_1 = require("fs");
var path_1 = require("path");
var __1 = require("..");
var PetalInteractionManager_1 = __importDefault(require("./PetalInteractionManager"));
var PetalStorage_1 = require("./PetalStorage");
var Petal = /** @class */ (function () {
    /**
     * Petal client constructor
     * @param opts Petal options
     * @example new Petal({ token: 'xxx' })
     */
    function Petal(opts) {
        var e_1, _a;
        var _this = this;
        var _b;
        /**
         * Handles incoming commands
         * @param message Discord.JS message
         * @param prefix Prefix to test for
         * @returns
         */
        this.handle_command = function (message, prefix) {
            var _a, _b;
            // Ignore bot users
            if (message.author.bot)
                return;
            // Ignore DM messages
            if (!message.guild)
                return;
            // Ignore messages without the prefix
            if (!message.content.startsWith(prefix))
                return;
            // Get constants
            var args = message.content.slice(prefix.length).trim().split(/ +/g);
            var command = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            // Ignore messages without commands
            if (!command)
                return;
            // Find command by name
            var run = _this.modules.commands[command];
            // Using alias
            if (!run)
                run = Object.values(_this.modules.commands).find(function (c) { return c.alias.indexOf(command) > -1; });
            // Using runas
            if (!run) {
                var run_1 = Object.values(_this.modules.commands).find(function (c) { return c.runas.find(function (r) { return r.name == command; }); });
                if (!run_1)
                    return;
                args = (((_b = (run_1.runas || []).find(function (r) { return r.name == command; })) === null || _b === void 0 ? void 0 : _b.arguments) || []).concat(args);
            }
            // Format args
            var formatted_args = _this.format_args(args, message, run);
            if (formatted_args.embeds !== undefined)
                return message.reply(formatted_args);
            formatted_args = formatted_args;
            run.run(_this, formatted_args, message, new PetalStorage_1.Store(_this.users, message.author.id), new PetalStorage_1.Store(_this.servers, message.guild.id))
                .then(function (response) {
                var enqueue_delete = function (sent_message) {
                    if (sent_message.deletable && !sent_message.deleted && run.delete === true)
                        setTimeout(function () { return sent_message.delete().catch(function () { }); }, 20 * 1000);
                };
                // Null response
                if (!response)
                    return;
                var content = _this.format_command_response(command, response);
                if (!message.deleted)
                    message.reply(content).then(enqueue_delete);
                else
                    message.channel.send(__assign(__assign({}, content), { content: message.author.toString() })).then(enqueue_delete);
            })
                .catch(console.error);
        };
        this.format_command_response = function (command_name, response_data) {
            var response = response_data;
            // MessageEmbed response
            if (response instanceof discord_js_1.MessageEmbed)
                return { embeds: [response] };
            // Mixed response
            else {
                // Convert type
                response = response;
                // Get embed
                var embed = response.shift();
                if (!(embed instanceof discord_js_1.MessageEmbed))
                    throw new TypeError(command_name + " returned an invalid value. Mixed Embed/ActionRow returns must begin with an embed");
                // TODO: Cleanup hacky solution
                var action_rows = response.shift();
                if (!action_rows)
                    throw new TypeError("Mixed Embed/ActionRow given but no action row was present.");
                // Ensure type
                if (action_rows.find(function (a) { return !(a instanceof discord_js_1.MessageActionRow); }))
                    throw new TypeError("Action row value provided not instance of action row");
                // Send message
                return ({
                    components: action_rows,
                    embeds: [embed]
                });
            }
        };
        this.format_args = function (given_arguments, message, command) {
            var _a, _b, _c, _d;
            var error = function (index, message) {
                return _this.error_handler(_this, message || command_arguments[index].message || "Invalid argument type provided.");
            };
            var formatted_args = [];
            var command_arguments = command.arguments;
            var _loop_2 = function (i) {
                if (!given_arguments[i] && command_arguments[i].required !== false)
                    return { value: error(i) };
                else if (!given_arguments[i])
                    return "break";
                switch (command_arguments[i].type) {
                    case "string":
                        if (typeof (given_arguments[i]) !== 'string')
                            return { value: error(i) };
                        if (command_arguments[i].list !== undefined) {
                            if (!((_a = command_arguments[i].list) === null || _a === void 0 ? void 0 : _a.find(function (argument) { return argument.value.toString().toLowerCase() === given_arguments[i].toLowerCase(); }))) {
                                return { value: error(i, "Invalid option from list:\n" + ((_b = command_arguments[i].list) === null || _b === void 0 ? void 0 : _b.map(function (argument) { return '— ' + argument.value.toString()[0].toUpperCase() + argument.value.toString().slice(1); }).join('\n'))) };
                            }
                            ;
                        }
                        formatted_args.push(given_arguments[i]);
                        break;
                    case "number":
                        if (isNaN(Number(given_arguments[i])))
                            return { value: error(i) };
                        if (command_arguments[i].list !== undefined) {
                            if (!((_c = command_arguments[i].list) === null || _c === void 0 ? void 0 : _c.find(function (argument) { return argument.value === given_arguments[i]; }))) {
                                return { value: error(i, "Invalid option from list:\n" + ((_d = command_arguments[i].list) === null || _d === void 0 ? void 0 : _d.map(function (argument) { return '— ' + argument.value; }).join('\n'))) };
                            }
                            ;
                        }
                        formatted_args.push(Number(given_arguments[i]));
                        break;
                    case "member":
                        if (!message.mentions.members)
                            return { value: error(i) };
                        var user_id_1 = (/[0-9]{18}/.exec(given_arguments[i]) || [])[0];
                        if (!user_id_1)
                            return { value: error(i) };
                        var user = message.mentions.members.find(function (u) { return u.id == user_id_1; });
                        if (!user)
                            return { value: error(i) };
                        formatted_args.push(user);
                        break;
                    case "channel":
                        if (!message.mentions.channels)
                            return { value: error(i) };
                        var channel_id_1 = (/[0-9]{18}/.exec(given_arguments[i]) || [])[0];
                        if (!channel_id_1)
                            return { value: error(i) };
                        var channel = message.mentions.channels.find(function (u) { return u.id == channel_id_1; });
                        if (!channel)
                            return { value: error(i) };
                        formatted_args.push(channel);
                        break;
                    case "role":
                        if (!message.mentions.roles)
                            return { value: error(i) };
                        var role_id_1 = (/[0-9]{18}/.exec(given_arguments[i]) || [])[0];
                        if (!role_id_1)
                            return { value: error(i) };
                        var role = message.mentions.roles.find(function (u) { return u.id == role_id_1; });
                        if (!role)
                            return { value: error(i) };
                        formatted_args.push(role);
                        break;
                    default:
                        throw new TypeError("Invalid type " + command_arguments[i].type + " provided.");
                }
            };
            for (var i = 0; i < command_arguments.length; i++) {
                var state_1 = _loop_2(i);
                if (typeof state_1 === "object")
                    return state_1.value;
                if (state_1 === "break")
                    break;
            }
            // Append any further arguments
            formatted_args = formatted_args.concat(given_arguments.slice(formatted_args.length));
            return formatted_args;
        };
        /**
         * Deploys slash commands globally or to a guild if provided
         * @param guild Guild to push to
         */
        this.deploy_commands = function (guild) {
            var _a;
            var command_data = Object.entries(_this.modules.commands).map(function (command) {
                var _a = __read(command, 2), name = _a[0], data = _a[1];
                return {
                    name: name.toLowerCase(),
                    description: data.description,
                    options: data.arguments.map(function (argument) {
                        var _a, _b, _c;
                        return {
                            required: (_a = argument.required) !== null && _a !== void 0 ? _a : false,
                            name: argument.name.toLowerCase(),
                            description: (_b = argument.description) !== null && _b !== void 0 ? _b : 'No description.',
                            choices: (_c = argument.list) !== null && _c !== void 0 ? _c : [],
                            type: (argument.type === 'role' ? "ROLE" :
                                argument.type === 'channel' ? "CHANNEL" :
                                    argument.type === 'member' ? "USER" :
                                        argument.type === 'number' ? "INTEGER" :
                                            "STRING")
                        };
                    })
                };
            });
            if (guild)
                guild.commands.set(command_data);
            else
                (_a = _this.client.application) === null || _a === void 0 ? void 0 : _a.fetch().then(function (application) {
                    application.commands.set(command_data);
                });
        };
        // Ensure opts
        if (!opts)
            throw new TypeError('Missing opts.');
        // Ensure token & intents
        if (!opts.token)
            throw new TypeError('Missing token.');
        if (!opts.intents)
            throw new TypeError('Missing client intents.');
        // Create client
        this.client = new discord_js_1.Client({
            intents: opts.intents
        });
        // Get absolute location
        this.absolute_module_location = opts.module_location;
        // Defaults
        this.modules = {
            events: {},
            commands: {},
            services: {}
        };
        // Error handler
        this.error_handler = (_b = opts.error_handler) !== null && _b !== void 0 ? _b : (function (_, message) {
            return {
                embeds: [
                    new discord_js_1.MessageEmbed()
                        .setColor(0xff006a)
                        .setTitle("\u274C Invalid arguments provided.")
                        .setDescription(message)
                ]
            };
        });
        // Load all commands, events & services
        ['commands', 'events', 'services'].forEach(function (sub) {
            var e_2, _a;
            // Absolute location of folder
            var sub_location = path_1.join(_this.absolute_module_location, sub);
            // Ensure folder exists
            if (!fs_1.existsSync(sub_location))
                throw new ReferenceError("No folder at " + sub_location + ". Ensure absolute path specified.");
            try {
                // Load all files into this.modules[sub]
                for (var _b = __values(fs_1.readdirSync(sub_location).filter(function (f) { return /\.js$/.test(f); })), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var file = _c.value;
                    var sub_module = require(path_1.join(sub_location, file));
                    if (!(sub_module instanceof (sub == 'commands' ? __1.PetalCommand : sub == 'services' ? Object : __1.PetalEvent))) {
                        throw new TypeError(file + " is not a Petal derivative.");
                    }
                    _this.modules[sub == 'commands' ? 'commands' :
                        sub == 'services' ? 'services' :
                            'events'][file.slice(0, -3)] = sub_module;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        });
        var _loop_1 = function (name_1, event_1) {
            if (name_1 === 'interactionCreate')
                throw new Error("The interactionCreate event is reserved by petal.");
            // Runs the event with the current petal instance prepended in the arguments
            this_1.client.on(name_1, function () {
                var _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = event_1).run.apply(_a, __spreadArray([_this], __read(args)));
            });
        };
        var this_1 = this;
        try {
            // Register events
            for (var _c = __values(Object.entries(this.modules.events)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), name_1 = _e[0], event_1 = _e[1];
                _loop_1(name_1, event_1);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Interaction manager
        this.interaction_manager = new PetalInteractionManager_1.default();
        this.client.on('interactionCreate', function (interaction) { return _this.interaction_manager.handle_interaction(interaction, _this); });
        // Data stores
        this.database_location = opts.database_location;
        this.users = PetalStorage_1.get_database('users', this.database_location);
        this.servers = PetalStorage_1.get_database('servers', this.database_location);
        // Login client
        this.client.login(opts.token);
    }
    return Petal;
}());
exports.default = Petal;
//# sourceMappingURL=Petal.js.map