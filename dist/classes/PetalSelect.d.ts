import { GuildMember, Interaction, MessageSelectMenu, MessageSelectOptionData, User } from "discord.js";
import { Petal } from "..";
export default class PetalSelect {
    private raw;
    /**
     * Petal select constructor
     */
    constructor();
    /**
     * Sets the placeholder text of the select menu
     * @param text Buttons label
     * @example <PetalSelect>.addOption({ label: 'Select me!!', description: 'A very important option!', value: 'option_1' });
     * @returns
     */
    addOption: (...options: MessageSelectOptionData[]) => PetalSelect;
    /**
     * Sets the placeholder text of the select menu
     * @param text Select menu's placeholder text
     * @example <PetalSelect>.setPlaceholder('Select something!');
     * @returns
     */
    setPlaceholder: (text: string) => PetalSelect;
    /**
     * Sets the disabled status of the select menu
     * @param disabled Select menu's disabled status
     * @example <PetalSelect>.setDisabled(true);
     * @returns
     */
    setDisabled: (disabled: boolean) => PetalSelect;
    /**
     * Sets the user who can use the select menu. If null, anyone can use the select menu
     * @param individual Select menu owner if any
     * @example <PetalSelect>.setIndividual(message.author);
     * @returns
     */
    setIndividual: (individual: User | GuildMember | null) => PetalSelect;
    /**
     * Sets the interaction handler for the select menu
     * @param handler Select menu interaction handler
     * @example <PetalSelect>.setHandler(petal, (interaction) => ...);
     * @returns
     */
    setHandler: (client: Petal, handler: (interaction: Interaction) => void) => PetalSelect;
    /**
     * Gets the select menu's raw data
     * @example <PetalSelect>.compile();
     * @returns
     */
    compile: () => MessageSelectMenu;
}
//# sourceMappingURL=PetalSelect.d.ts.map