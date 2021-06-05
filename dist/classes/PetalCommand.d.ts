import { Message, MessageActionRow, MessageEmbed } from 'discord.js';
import { Petal } from '..';
import { Store } from "./PetalStorage";
declare type PetalCommandOpts = {
    description?: string;
    example?: string;
    group?: string;
    arguments?: PetalCommandArguments[];
    runas?: PetalCommandRunas[];
    alias?: string[];
    delete?: boolean;
};
declare type PetalCommandArguments = {
    name: string;
    description?: string;
    type: 'string' | 'number' | 'member' | 'channel';
    options?: string[];
    message?: string;
    required?: boolean;
};
declare type PetalCommandRunas = {
    name: string;
    arguments: Array<string>;
};
export declare type PetalCommandResponse = Promise<MessageEmbed | Array<MessageEmbed | Array<MessageActionRow>> | null>;
export default class PetalCommand {
    description: string;
    example: string;
    group: string;
    arguments: PetalCommandArguments[];
    runas: PetalCommandRunas[];
    alias: string[];
    delete: boolean;
    /**
     * Petal command constructor
     * @param opts Petal command data
     * @example new PetalCommand({ })
     */
    constructor(opts: PetalCommandOpts);
    /**
     * Command run function
     * @param petal Petal instance
     * @param args Message arguments
     * @param message Message object
     * @param user_data user data store
     * @param server_data server data store
     */
    run(petal: Petal, args: any[], message: Message, user_data: typeof Store, server_data: typeof Store): PetalCommandResponse;
}
export {};
//# sourceMappingURL=PetalCommand.d.ts.map