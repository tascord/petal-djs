import { ApplicationCommandOptionChoice, ApplicationCommandOptionData, CommandInteraction, Message, MessageActionRow, MessageAttachment, MessageEmbed } from 'discord.js';
import { Petal } from '..';
import { Store } from "./PetalStorage";

type PetalCommandOpts = {

    description?: string,
    example?: string,
    group?: string,
    arguments?: PetalCommandArguments[],
    runas?: PetalCommandRunas[],
    alias?: string[],
    delete?: boolean,

}

type PetalCommandArguments = {

    name: string,
    description?: string,
    type: 'string' | 'number' | 'member' | 'channel' | 'role',
    options?: string[],
    message?: string,
    required?: boolean,
    list?: ApplicationCommandOptionChoice[]

}

type PetalCommandRunas = {

    name: string,
    arguments: Array<string>

}

export type PetalCommandResponse = Promise<PetalCommandResponseData>;
export type PetalCommandResponseData = MessageEmbed | [MessageEmbed, Array<MessageActionRow>] | [MessageEmbed, Array<MessageActionRow>, MessageAttachment[]] |  null;

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
     * @example new PetalCommand()
     */
    constructor(opts: PetalCommandOpts = {}) {

        if (!opts) throw new TypeError(`No command opts provided.`);

        this.description = opts.description ??= 'No description.';
        this.example = opts.example ??= 'No example.';
        this.group = opts.group ??= 'Un-grouped';
        this.arguments = opts.arguments ??= [];
        this.runas = opts.runas ??= [];
        this.alias = opts.alias ??= [];
        this.delete = opts.delete ??= true;

        for(let argument of this.arguments) {

            if(argument.list && (argument.type !== 'string' && argument.type !== 'number')) throw new TypeError(`Cannot have list items and a non string nor numerical value`);

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
    run(petal: Petal, args: any[], message: Message | CommandInteraction, user_data: Store, server_data: Store): PetalCommandResponse { return Promise.resolve(null); }


}