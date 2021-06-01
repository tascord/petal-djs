import { Interaction } from "discord.js";
export default class PetalInteractionManager {
    interactions: {};
    constructor();
    add_interaction: (handler: Function, custom_id?: string | undefined) => string;
    handle_interaction: (interaction: Interaction) => void;
    generate_token: () => string;
}
//# sourceMappingURL=PetalInteractionManager.d.ts.map