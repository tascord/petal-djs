import { Client, Guild, Intents, Message, MessageActionRow, MessageEmbed, ReplyMessageOptions } from "discord.js";
import { table } from "quick.db";
import { PetalCommand, PetalEvent } from "..";
import PetalInteractionManager from "./PetalInteractionManager";
declare type PetalOps = {
    module_location?: string;
    database_location?: string;
    token: string;
    intents: Intents;
    error_handler?: (error: string) => ReplyMessageOptions;
};
export default class Petal {
    client: Client;
    absolute_module_location: string;
    modules: {
        events: {
            [key: string]: PetalEvent;
        };
        commands: {
            [key: string]: PetalCommand;
        };
        services: {
            [key: string]: any;
        };
    };
    interaction_manager: PetalInteractionManager;
    database_location: string | undefined;
    users: table;
    servers: table;
    error_handler: (error: string) => ReplyMessageOptions;
    /**
     * Petal client constructor
     * @param opts Petal options
     * @example new Petal({ token: 'xxx' })
     */
    constructor(opts: PetalOps);
    /**
     * Handles incoming commands
     * @param message Discord.JS message
     * @param prefix Prefix to test for
     * @returns
     */
    handle_command: (message: Message, prefix: string) => Promise<Message> | undefined;
    format_command_response: (command_name: string, response_data: MessageEmbed | [MessageEmbed, MessageActionRow[]]) => ReplyMessageOptions;
    format_args: (given_arguments: Array<string>, message: Message, command: PetalCommand) => Array<any> | ReplyMessageOptions;
    /**
     * Deploys slash commands globally or to a guild if provided
     * @param guild Guild to push to
     */
    deploy_commands: (guild?: Guild | undefined) => void;
}
export {};
//# sourceMappingURL=Petal.d.ts.map