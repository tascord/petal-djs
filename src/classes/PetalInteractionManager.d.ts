import { Interaction } from "discord.js";
export default class PetalInteractionManager {
    interactions: {};
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
    register_interaction: (handler: Function, linked_user: string | null, custom_id?: string | undefined) => string;
    handle_interaction: (interaction: Interaction) => void;
    generate_token: () => string;
}
//# sourceMappingURL=PetalInteractionManager.d.ts.map