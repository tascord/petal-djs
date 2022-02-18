import { ApplicationCommandData, Client, Guild, Intents, Interaction, Message, MessageActionRow, MessageAttachment, MessageEmbed, ReplyMessageOptions } from "discord.js";
import { existsSync, readdirSync } from "fs";
import { join } from "path";
import { PetalCommand, PetalEvent } from "..";
import PetalInteractionManager from "./PetalInteractionManager";
import { get_database, Store } from "./PetalStorage";
import { PetalCommandResponseData } from "./PetalCommand";
import { Hastyable } from "hasty.db";

type PetalOps = {
    module_location?: string,
    database_location?: string,
    token: string,
    intents: Intents,
    error_handler?: (petal: Petal, error: string) => ReplyMessageOptions;
}

export default class Petal {

    client: Client;
    absolute_module_location: string;
    modules: {
        events: { [key: string]: PetalEvent },
        commands: { [key: string]: PetalCommand },
        services: { [key: string]: any }
    };
    interaction_manager: PetalInteractionManager;
    database_location: string | undefined;
    users: Hastyable;
    servers: Hastyable;
    error_handler: (petal: Petal, error: string) => ReplyMessageOptions;

    /**
     * Petal client constructor
     * @param opts Petal options
     * @example new Petal({ token: 'xxx' })
     */
    constructor(opts: PetalOps) {

        // Ensure opts
        if (!opts) throw new TypeError('Missing opts.');

        // Ensure token & intents
        if (!opts.token) throw new TypeError('Missing token.')
        if (!opts.intents) throw new TypeError('Missing client intents.');

        // Create client
        this.client = new Client({
            intents: opts.intents
        })

        // Get absolute location
        this.absolute_module_location = (opts.module_location as string);

        // Defaults
        this.modules = {
            events: {},
            commands: {},
            services: {}
        };

        // Error handler
        this.error_handler = opts.error_handler ?? ((_: Petal, message: string): ReplyMessageOptions => {

            return {
                embeds: [
                    new MessageEmbed()
                        .setColor(0xff006a)
                        .setTitle(`❌ Invalid arguments provided.`)
                        .setDescription(message)
                ]
            };

        });

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

            if (name === 'interactionCreate') throw new Error(`The interactionCreate event is reserved by petal.`);

            // Runs the event with the current petal instance prepended in the arguments
            this.client.on(name, (...args: any) => {
                (event as PetalEvent).run(this, ...args);
            });

        }

        // Interaction manager
        this.interaction_manager = new PetalInteractionManager();
        this.client.on('interactionCreate', (interaction: Interaction) => this.interaction_manager.handle_interaction(interaction, this));

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
        let run: PetalCommand | undefined = this.modules.commands[command];

        // Using alias
        if (!run) run = Object.values(this.modules.commands).find(c => (c as PetalCommand).alias.indexOf(command) > -1);

        // Using runas
        if (!run) {

            let run = Object.values(this.modules.commands).find(c => (c as PetalCommand).runas.find(r => r.name == command));
            if (!run) return;

            args = (((run as PetalCommand).runas || []).find(r => r.name == command)?.arguments || []).concat(args)

        }

        // Format args
        let formatted_args: any[] | ReplyMessageOptions = this.format_args(args, message, run as PetalCommand);
        if ((formatted_args as ReplyMessageOptions).embeds !== undefined) return message.reply(formatted_args as ReplyMessageOptions);
        formatted_args = formatted_args as any[];

        (run as PetalCommand).run(this, formatted_args, message, new Store(this.users, message.author.id), new Store(this.servers, message.guild.id))

            .then((response: PetalCommandResponseData) => {

                const enqueue_delete = (sent_message: Message) => {
                    if (sent_message.deletable && !sent_message.deleted && (run as PetalCommand).delete === true) setTimeout(() => sent_message.delete().catch(() => { }), 20 * 1000);
                }

                // Null response
                if (!response) return;

                const content = this.format_command_response(command, response);
                if (!message.deleted) message.reply(content).then(enqueue_delete);
                else message.channel.send({ ...content, content: message.author.toString() }).then(enqueue_delete);

            })

            .catch(console.error);


    }

    format_command_response = (command_name: string, response_data: NonNullable<PetalCommandResponseData>): ReplyMessageOptions => {

        let response = response_data;

        // MessageEmbed response
        if (response instanceof MessageEmbed) return { embeds: [response] };

        // Mixed response
        else {

            // Convert type
            response = (response as [MessageEmbed, MessageActionRow[]] | [MessageEmbed, MessageActionRow[], MessageAttachment[]]);

            // Get embed
            let embed = response.shift();
            if (!(embed instanceof MessageEmbed)) throw new TypeError(`${command_name} returned an invalid value. Mixed Embed/ActionRow returns must begin with an embed`);

            // Get actions
            let action_rows = response.shift() as MessageActionRow[];
            if (action_rows.find(a => !(a instanceof MessageActionRow))) throw new TypeError(`Action row value provided not instance of action row`);

            // Get attachments
            let attachments = (response.shift() ?? []) as MessageAttachment[];
            if (attachments.find(a => !(a instanceof MessageAttachment))) throw new TypeError(`Attachment value provided not instance of attachment`);

            // Send message
            return ({
                components: action_rows,
                embeds: [embed],
                files: attachments
            })

        }

    }

    format_args = (given_arguments: Array<string>, message: Message, command: PetalCommand): Array<any> | ReplyMessageOptions => {

        const error = (index: number, message?: string): ReplyMessageOptions => {

            return this.error_handler(this, message || command_arguments[index].message || `Invalid argument type provided.`);

        }

        let formatted_args: Array<any> = [];
        let command_arguments = command.arguments;

        for (let i = 0; i < command_arguments.length; i++) {

            if (!given_arguments[i] && command_arguments[i].required !== false) return error(i);
            else if (!given_arguments[i]) break;

            switch (command_arguments[i].type) {

                case "string":
                    if (typeof (given_arguments[i]) !== 'string') return error(i);
                    if (command_arguments[i].list !== undefined) {
                        if (!command_arguments[i].list?.find(argument => argument.value.toString().toLowerCase() === given_arguments[i].toLowerCase())) {
                            return error(i, `Invalid option from list:\n${command_arguments[i].list?.map(argument => '— ' + argument.value.toString()[0].toUpperCase() + argument.value.toString().slice(1)).join('\n')}`);
                        };
                    }
                    formatted_args.push(given_arguments[i]);
                    break;

                case "number":
                    if (isNaN(Number(given_arguments[i]))) return error(i);
                    if (command_arguments[i].list !== undefined) {
                        if (!command_arguments[i].list?.find(argument => argument.value === given_arguments[i])) {
                            return error(i, `Invalid option from list:\n${command_arguments[i].list?.map(argument => '— ' + argument.value).join('\n')}`);
                        };
                    }
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

                case "role":
                    if (!message.mentions.roles) return error(i);

                    let role_id = (/[0-9]{18}/.exec(given_arguments[i]) || [])[0];
                    if (!role_id) return error(i);

                    let role = message.mentions.roles.find((u: any) => u.id == role_id);
                    if (!role) return error(i);

                    formatted_args.push(role);
                    break;

                default:
                    throw new TypeError(`Invalid type ${command_arguments[i].type} provided.`);

            }

        }

        // Append any further arguments
        formatted_args = formatted_args.concat(given_arguments.slice(formatted_args.length));

        return formatted_args;

    }

    /**
     * Deploys slash commands globally or to a guild if provided
     * @param guild Guild to push to
     */
    deploy_commands = (guild?: Guild) => {

        // TODO: Typedef
        const command_data: any[] = Object.entries(this.modules.commands).map((command) => {

            const [name, data] = command;
            return {
                name: name.toLowerCase(),
                description: data.description,
                options: data.arguments.map(argument => {

                    return {
                        required: argument.required ?? false,
                        name: argument.name.toLowerCase(),
                        description: argument.description ?? 'No description.',
                        choices: argument.list ?? [],
                        type: (
                            argument.type === 'role' ? "ROLE" :
                                argument.type === 'channel' ? "CHANNEL" :
                                    argument.type === 'member' ? "USER" :
                                        argument.type === 'number' ? "INTEGER" :
                                            "STRING"
                        )
                    }

                })
            }

        });

        if (guild) guild.commands.set(command_data);
        else this.client.application?.fetch().then(application => {
            application.commands.set(command_data);
        })

    }

}
