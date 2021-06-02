import { Client, Intents, Message, MessageActionRow, MessageEmbed } from "discord.js";
import { existsSync, readdirSync } from "fs";
import { table } from "quick.db";
import { join } from "path";
import { PetalCommand, PetalEvent } from "..";
import PetalInteractionManager from "./PetalInteractionManager";
import { get_database, Store } from "./PetalStorage";


type PetalOps = {
    module_location?: string,
    privileged_intents?: boolean,
    database_location?: string,
    token: string,
}

export default class Petal {

    client: Client;
    absolute_module_location: string;
    modules: {
        events: {},
        commands: {},
        services: {}
    };
    interaction_manager: PetalInteractionManager;
    database_location: string | undefined;
    users: table;
    servers: table;

    /**
     * Petal client constructor
     * @param opts Petal options
     * @example new Petal({ token: 'xxx' })
     * // => Petal Client
     */
    constructor(opts: PetalOps) {

        // Ensure opts
        if (!opts) throw new TypeError('Missing opts.');

        // Create client
        this.client = new Client({
            intents: (opts.privileged_intents || false) ? Intents.NON_PRIVILEGED : Intents.ALL
        })

        // Get absolute location
        this.absolute_module_location = (opts.module_location as string);

        // Defaults
        this.modules = {
            events: {},
            commands: {},
            services: {}
        };

        // Load all commands, events & services
        ['commands', 'events', 'services'].forEach(sub => {

            // Absolute location of folder
            let sub_location = join(this.absolute_module_location, sub);

            // Ensure folder exists
            if (!existsSync(sub_location)) throw new ReferenceError(`No folder at ${sub_location}. Ensure absolute path specified.`);

            // Load all files into this.modules[sub]
            for (let file of readdirSync(sub_location).filter(f => /\.js$/.test(f))) {

                let sub_module = require(join(sub_location, file));
                if (!(sub_module instanceof (sub == 'commands' ? PetalCommand : sub == 'services' ? Object : PetalEvent))) {
                    throw new TypeError(`${file} is not a Petal derivative.`);
                }

                (this.modules[
                    sub == 'commands' ? 'commands' :
                        sub == 'services' ? 'services' :
                            'events'
                ] as any)
                [file.slice(0, -3)] = sub_module;

            }

        });

        // Register events
        for (let [name, event] of Object.entries(this.modules.events)) {

            if (name === 'interaction') throw new Error(`The interaction event is reserved by petal.`);

            // Runs the event with the current petal instance prepended in the arguments
            this.client.on(name, (...args: any) => {
                (event as PetalEvent).run(this, ...args);
            });

        }

        // Interaction manager
        this.interaction_manager = new PetalInteractionManager();
        this.client.on('interaction', this.interaction_manager.handle_interaction);

        // Data stores
        this.database_location = opts.database_location;
        this.users = get_database('users', this.database_location);
        this.servers = get_database('servers', this.database_location);

        // Login client
        this.client.login(opts.token);

    }

    /**
     * Handles incoming commands
     * @param message Discord.JS message
     * @param prefix Prefix to test for
     * @returns 
     */
    handle_command = (message: Message, prefix: string) => {

        // Ignore bot users
        if (message.author.bot) return;

        // Ignore DM messages
        if (!message.guild) return;

        // Ignore messages without the prefix
        if (!message.content.startsWith(prefix)) return;

        // Get constants
        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift()?.toLowerCase();

        // Ignore messages without commands
        if (!command) return;

        // Find command by name
        let run = (this.modules.commands as any)[command];

        // Using alias
        if (!run) run = Object.values(this.modules.commands).find(c => (c as PetalCommand).alias.indexOf(command) > -1);

        // Using runas
        if (!run) {

            let run = Object.values(this.modules.commands).find(c => (c as PetalCommand).runas.find(r => r.name == command));
            if (!run) return;

            args = (((run as PetalCommand).runas || []).find(r => r.name == command)?.arguments || []).concat(args)

        }

        // Format args
        let formatted_args = this.format_args(args, message, run);
        if (formatted_args instanceof MessageEmbed) return message.reply(formatted_args);

        run.run(this, formatted_args, message, new Store(this.users, message.author.id), new Store(this.servers, message.guild.id))

            .then((response: MessageEmbed | Array<MessageEmbed | Array<MessageActionRow>> | null) => {

                // Null response
                if (!response) return;

                // MessageEmbed response
                if (response instanceof MessageEmbed) return message.reply(response);

                // Mixed response
                else {

                    // Convert type
                    response = (response as Array<MessageEmbed | Array<MessageActionRow>>);

                    // Get embed
                    let embed = response.shift();
                    if (!(embed instanceof MessageEmbed)) throw new TypeError(`${command} returned an invalid value. Mixed Embed/ActionRow returns must begin with an embed`);

                    let action_rows = (response as Array<Array<MessageActionRow>>).shift();
                    if (!action_rows) throw new TypeError(`Mixed Embed/ActionRow given but no action row was present.`);

                    // Ensure type
                    if (action_rows.find(a => !(a instanceof MessageActionRow))) throw new TypeError(`Action row value provided not instance of action row`);

                    // Send message
                    message.reply('', {
                        components: action_rows,
                        embed: embed
                    })

                }

            })

            .catch(console.error);


    }

    format_args = (given_arguments: Array<string>, message: Message, command: PetalCommand): Array<any> | MessageEmbed => {

        const error = (index: number, message?: string): MessageEmbed => {

            return new MessageEmbed()
                .setColor(0xff006a)
                .setTitle(`❌ Invalid arguments provided.`)
                .setDescription(message || command_arguments[index].message || `Invalid argument type provided.`);

        }

        let formatted_args: Array<any> = [];
        let command_arguments = command.arguments;

        for (let i = 0; i < command_arguments.length; i++) {

            if (!given_arguments[i] && command_arguments[i].required !== false) return error(i);
            else if (!given_arguments[i]) break;

            switch (command_arguments[i].type) {

                case "string":
                    if (typeof (given_arguments[i]) !== command_arguments[i].type) return error(i);
                    formatted_args.push(given_arguments[i]);
                    break;

                case "number":
                    if (isNaN(Number(given_arguments[i]))) return error(i);
                    formatted_args.push(Number(given_arguments[i]));
                    break;

                case "member":
                    if (!message.mentions.members) return error(i);

                    let user_id = (/[0-9]{18}/.exec(given_arguments[i]) || [])[0];
                    if (!user_id) return error(i);

                    let user = message.mentions.members.find((u: any) => u.id == user_id);
                    if (!user) return error(i);

                    formatted_args.push(user);
                    break;

                case "channel":
                    if (!message.mentions.channels) return error(i);

                    let channel_id = (/[0-9]{18}/.exec(given_arguments[i]) || [])[0];
                    if (!channel_id) return error(i);

                    let channel = message.mentions.channels.find((u: any) => u.id == channel_id);
                    if (!channel) return error(i);

                    formatted_args.push(channel);
                    break;

                default:
                    throw new TypeError(`Invalid type ${command_arguments[i].type} provided.`);

            }

        }

        return formatted_args;

    }

}
