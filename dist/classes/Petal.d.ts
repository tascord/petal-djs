import { Client, Message, MessageEmbed } from "discord.js";
import { table } from "quick.db";
import { PetalCommand } from "..";
import PetalInteractionManager from "./PetalInteractionManager";
declare type PetalOps = {
    module_location?: string;
    privileged_intents?: boolean;
    database_location?: string;
    token: string;
};
export default class Petal {
    client: Client;
    absolute_module_location: string;
    modules: {
        events: {};
        commands: {};
        services: {};
    };
    interaction_manager: PetalInteractionManager;
    database_location: string | undefined;
    users: table;
    servers: table;
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
    format_args: (given_arguments: Array<string>, message: Message, command: PetalCommand) => Array<any> | MessageEmbed;
}
export {};
//# sourceMappingURL=Petal.d.ts.map