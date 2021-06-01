import { Message, MessageActionRow, MessageEmbed } from 'discord.js';
import { Petal } from '..';

import Storage from "./PetalStorage";
const { Store } = Storage;

type PetalCommandOpts = {

    description?: string,
    example?: string,
    group?: string,
    arguments?: PetalCommandArguments[],
    runas?: PetalCommandRunas[],
    alias?: string[]

}

type PetalCommandArguments = {

    name: string,
    description?: string,
    type: 'string' | 'number' | 'member' | 'channel' | 'list',
    options?: string[],
    message?: string,
    required?: boolean,

}

type PetalCommandRunas = {

    name: string,
    arguments: Array<string>

}

export type PetalCommandResponse = Promise<MessageEmbed | Array<MessageEmbed|Array<MessageActionRow>> | null>;

export default class PetalCommand {

    description: string;
    example: string;
    group: string;
    arguments: PetalCommandArguments[];
    runas: PetalCommandRunas[];
    alias: string[];

    /**
     * Petal command constructor
     * @param opts Petal command data
     * @example new PetalCommand({  })
     */
    constructor(opts: PetalCommandOpts) {

        if(!opts) throw new TypeError(`No command opts provided.`);
        
        this.description = opts.description || 'No description.';
        this.example = opts.example || 'No example.';
        this.group = opts.group || 'Un-grouped';
        this.arguments = opts.arguments || [];
        this.runas = opts.runas || [];
        this.alias = opts.alias || [];

    }

    /**
     * Command run function
     * @param petal Petal instance
     * @param args Message arguments
     * @param message Message object
     * @param user_data user data store
     * @param server_data server data store
     */
    run(petal: Petal, args: any[], message: Message, user_data: typeof Store, server_data: typeof Store): PetalCommandResponse { return Promise.resolve(null); }


}