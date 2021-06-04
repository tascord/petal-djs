import { Interaction } from "discord.js";
declare type PetalInteractionData = {
    handler: Function;
    linked_user: string | null;
    single: boolean;
    custom_id: string;
};
export default class PetalInteractionManager {
    interactions: {
        string: PetalInteractionData;
    } | {};
    /**
     * InteractionManager constructor
     */
    constructor();
    /**
     * Registers an interaction
     * @param handler
     * @param custom_id
     * @returns
     */
    register_interaction: (handler: Function, linked_user: string | null, single: boolean, custom_id?: string | undefined) => string;
    /**
     * Handles an interaction
     * @param interaction Interaction data
     */
    handle_interaction: (interaction: Interaction) => void;
    /**
     * Generates an unused token (custom_id)
     * @returns Unused token
     */
    generate_token: () => string;
}
export {};
//# sourceMappingURL=PetalInteractionManager.d.ts.map