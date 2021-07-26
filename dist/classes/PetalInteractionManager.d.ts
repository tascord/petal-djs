import { Interaction } from "discord.js";
import Petal from "./Petal";
declare type PetalInteractionData = {
    handler: Function;
    linked_user: string | null;
    single: boolean;
    custom_id: string;
};
export default class PetalInteractionManager {
    interactions: {
        [key: string]: PetalInteractionData;
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
    handle_interaction: (interaction: Interaction, petal: Petal) => void;
    /**
     * Generates an unused token (custom_id)
     * @returns Unused token
     */
    generate_token: () => string;
}
export {};
//# sourceMappingURL=PetalInteractionManager.d.ts.map