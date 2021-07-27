import { Channel, GuildMember, Interaction, Role } from "discord.js";
import Petal from "./Petal";
import { PetalCommandResponseData } from "./PetalCommand";
import { Store } from "./PetalStorage";

type PetalInteractionData = {
    handler: (interaction: Interaction) => void,
    linked_user: string | null,
    single: boolean,
    registered: number
}

type PetalInteractionManagerOpts = {

    cache_time?: number

}

export default class PetalInteractionManager {

    interactions: { [key: string]: PetalInteractionData };

    /**
     * InteractionManager constructor
     */
    constructor(opts: PetalInteractionManagerOpts = {}) {
        this.interactions = {};
        setInterval(() => {

            for (let [key, value] of Object.entries(this.interactions)) {

                let registered = (value as any).registered;

                if (!registered) {
                    console.warn(`No registered time for ${key}.`);
                    continue;
                }

                if (Date.now() - registered > (opts.cache_time ?? 5 * 60 * 1000)) delete (this.interactions as any)[key];

            }

        }, 30 * 1000)
    }

    /**
     * Registers an interaction
     * @param handler 
     * @param custom_id 
     * @returns 
     */
    register_interaction = (handler: (interaction: Interaction) => void, linked_user: string | null, single: boolean, custom_id?: string): string => {

        let id = custom_id || this.generate_token();
        this.interactions[id] = {
            handler,
            linked_user,
            single: single,
            registered: Date.now()
        }

        return id;

    }

    /**
     * Handles an interaction
     * @param interaction Interaction data
     */
    handle_interaction = async (interaction: Interaction, petal: Petal) => {

        // Slash Commands
        if (interaction.isCommand()) {

            // Defer temporarily
            interaction.defer();

            // Get corresponding command
            const command = petal.modules.commands[interaction.commandName];

            // Warn on no handler
            if (!command) {
                console.warn(`Command '/${interaction.commandName}' was run, however the command file doesn't exist.`);
                interaction.deleteReply();
            }

            if (!interaction.guildId) return;
            await (await petal.client.guilds.fetch());

            const guild = petal.client.guilds.cache.get(interaction.guildId);
            if (!guild) return;

            // Arguments 
            const compiled_arguments = command.arguments.map(command_argument => {

                const argument = interaction.options.get(command_argument.name.toLowerCase(), command_argument.required);
                if (!argument) return null;

                if (command_argument.type === 'channel') return argument.channel;
                if (command_argument.type === 'number') return argument.value;
                if (command_argument.type === 'string') return argument.value;
                if (command_argument.type === 'role') return argument.role;
                if (command_argument.type === 'member') return argument.member;

            })

            for (let i = 0; i < compiled_arguments.length; i++) {

                let v = compiled_arguments[i];

                const type =
                    (v instanceof Channel) ? 'channel' :
                        (v instanceof Role) ? 'role' :
                            (v instanceof GuildMember) ? 'member' :
                                (typeof (v) === 'number') ? 'number' :
                                    'string';


                if (command.arguments[i].type !== type) {

                    if (!(v === null && !command.arguments[i].required))
                        return interaction.followUp(petal.error_handler(command.arguments[i].message ?? `Invalid argument type provided.`));

                }

            }

            // Handle command
            command.run(
                petal,
                compiled_arguments,
                interaction,
                new Store(petal.users, interaction.user.id),
                new Store(petal.servers, (interaction.guild?.id ?? 'NULL').toString())
            )

                .then((response: PetalCommandResponseData) => {

                    if (response === null) return interaction.deleteReply();
                    const message_data = petal.format_command_response(interaction.commandName, response);

                    interaction.followUp(message_data);

                })

        }

        // Message Buttons / Select Menu's
        else if (interaction.isButton() || interaction.isSelectMenu()) {

            if (!(interaction as any).customId) {

                // Handle action if un-registered
                if ((interaction as any).deferUpdate) (interaction as any).deferUpdate();

            };

            let data = ((this.interactions as any)[(interaction as any).customId] as PetalInteractionData | null);

            if (!data) return (interaction as any).deferUpdate();
            if (data.linked_user ? data.linked_user != interaction.user.id : false) return (interaction as any).deferUpdate();

            data.handler(interaction);
            if (data.single) delete (this.interactions as any)[(interaction as any).customId];


        }

    }

    /**
     * Generates an unused token (custom_id)
     * @returns Unused token
     */
    generate_token = (): string => {

        let token: string;

        do {
            token = 'petal_xxxxxxxxxx'.replace(/x/g, () => {
                return Math.floor(Math.random() * 11).toString()
            });
        }

        while (
            (this.interactions as any)[token]
        )

        return token;

    }

}
