import { GuildMember, MessageSelectMenu, MessageSelectOptionData, User } from "discord.js";
import { Petal } from "..";

type PetalRawButton = {
    disabled?: boolean,
    placeholder?: string,
    custom_id?: string,
    individual?: string,
    min_values?: number,
    max_values?: number,
    options: MessageSelectOptionData[]
}

export default class PetalSelect {

    private raw: PetalRawButton

    /**
     * Petal select constructor
     */
    constructor() {
        this.raw = {
            options: []
        };
    }

    /**
     * Sets the placeholder text of the select menu
     * @param text Buttons label
     * @example <PetalSelect>.addOption({ label: 'Select me!!', description: 'A very important option!', value: 'option_1' });
     * @returns
     */
    addOption = (...options: MessageSelectOptionData[]): PetalSelect => {
        this.raw.options = this.raw.options.concat(options);
        return this;
    }

    /**
     * Sets the placeholder text of the select menu
     * @param text Select menu's placeholder text
     * @example <PetalSelect>.setPlaceholder('Select something!');
     * @returns
     */
    setPlaceholder = (text: string): PetalSelect => {
        if (text.length > 80) throw new TypeError('Button label length to long. Max 80 characters.');
        this.raw.placeholder = text;
        return this;
    }

    /**
     * Sets the disabled status of the select menu
     * @param disabled Select menu's disabled status
     * @example <PetalSelect>.setDisabled(true);
     * @returns
     */
    setDisabled = (disabled: boolean): PetalSelect => {
        this.raw.disabled = disabled;
        return this;
    }

    /**
     * Sets the user who can use the select menu. If null, anyone can use the select menu
     * @param individual Select menu owner if any
     * @example <PetalSelect>.setIndividual(message.author);
     * @returns 
     */
    setIndividual = (individual: User | GuildMember | null): PetalSelect => {
        if (this.raw.custom_id) throw new TypeError(`Cannot set individuality after handler is set.`);
        this.raw.individual = individual ? individual.id : undefined;
        return this;
    }

    /**
     * Sets the interaction handler for the select menu
     * @param handler Select menu interaction handler
     * @example <PetalSelect>.setHandler(petal, (interaction) => ...);
     * @returns 
     */
    setHandler = (client: Petal, handler: Function): PetalSelect => {
        if (this.raw.custom_id) throw new TypeError(`Handler already declared, custom_id present.`);
        this.raw.custom_id = client.interaction_manager.register_interaction(handler, this.raw.individual || null, false);
        return this;
    }

    /**
     * Gets the select menu's raw data
     * @example <PetalSelect>.compile();
     * @returns
     */
    compile = (): MessageSelectMenu => {

        if (!this.raw.disabled) this.raw.disabled = false;
        if (!this.raw.placeholder) this.raw.placeholder = 'Select an option.';

        let menu = new MessageSelectMenu();
        if (this.raw.placeholder) menu.setPlaceholder(this.raw.placeholder);
        if (this.raw.custom_id) menu.setCustomId(this.raw.custom_id);
        if (this.raw.min_values) menu.setMinValues(this.raw.min_values)
        if (this.raw.max_values) menu.setMaxValues(this.raw.max_values);

        menu.setDisabled(menu.disabled);
        menu.addOptions(this.raw.options);

        return menu;

    };

}
