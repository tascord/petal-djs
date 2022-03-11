import { GuildMember, Interaction, MessageButton, User } from "discord.js";
import { Petal } from "..";
import constants from "../constants";

type PetalRawButton = {
    type: number,
    style?: number,
    disabled?: boolean,
    url?: string,
    emoji?: string | null,
    label?: string | null,
    custom_id?: string,
    individual?: string,
    single?: boolean
}

export default class PetalButton {

    private raw: PetalRawButton

    /**
     * Petal button constructor
     */
    constructor() {
        this.raw = {
            type: 2
        };
    }

    /**
     * Sets the style of the button
     * * The style of link buttons is always grey
     * @param style Buttons style
     * @example <PetalButton>.setStyle('green');
     * @returns
     */
    setStyle = (style: 'blurple' | 'grey' | 'green' | 'red'): PetalButton => {
        this.raw.style = style == 'blurple' ? 1 : style == 'grey' ? 2 : style == 'green' ? 3 : 4;
        return this;
    }

    /**
     * Sets the label of the button
     * @param label Buttons label
     * @example <PetalButton>.setLabel('Petal buttons!');
     * @returns
     */
    setLabel = (label: string): PetalButton => {
        if (label.length > 80) throw new TypeError('Button label length to long. Max 80 characters.');
        this.raw.label = label;
        return this;
    }

    /**
     * Sets the emoji of the button
     * @param emoji Buttons emoji
     * @example <PetalButton>.setEmoji('💖');
     * @returns
     */
    setEmoji = (emoji: string): PetalButton => {
        if (!constants.emoji_regex.test(emoji)) throw new TypeError('Invalid emoji. Fails RGI Regex');
        this.raw.emoji = emoji;
        return this;
    }

    /**
     * Sets the link of the button
     * * This sets the button to be a link button. All styles will be ignored and handlers will error.
     * @param url Buttons link
     * @example <PetalButton>.setURL('https://github.com/tascord/petal')
     * @returns
     */
    setURL = (url: string): PetalButton => {
        this.raw.url = url;
        return this;
    }

    /**
     * Sets the disabled status of the button
     * @param disabled Buttons disabled status
     * @example <PetalButton>.setDisabled(true);
     * @returns
     */
    setDisabled = (disabled: boolean): PetalButton => {
        this.raw.disabled = disabled;
        return this;
    }

    /**
     * Sets whether the button will cease functionality after initial interaction
     * * Link buttons will cause this to error as they cannot have handlers
     * @param single Button singularity
     * @example <PetalButton>.setSingle(true);
     * @returns 
     */
    setSingle = (single: boolean): PetalButton => {
        if (this.raw.url) throw new TypeError(`Cannot set singularity of link button.`)
        if (this.raw.custom_id) throw new TypeError(`Cannot set singularity after handler is set.`);
        this.raw.single = single;
        return this;
    }

    /**
     * Sets the user who can use the button. If null, anyone can use the button
     * * Link buttons will cause this to error as they cannot have handlers
     * @param individual Button owner if any
     * @example <PetalButton>.setIndividual(message.author);
     * @returns 
     */
    setIndividual = (individual: User | GuildMember | null): PetalButton => {
        if (this.raw.url) throw new TypeError(`Cannot set individuality of link button.`)
        if (this.raw.custom_id) throw new TypeError(`Cannot set individuality after handler is set.`);
        this.raw.individual = individual ? individual.id : undefined;
        return this;
    }

    /**
     * Sets the interaction handler for the button
     * * Link buttons will cause this to error as they cannot have handlers
     * @param handler Button interaction handler
     * @example <PetalButton>.setHandler(petal, (interaction) => interaction.message.delete());
     * @returns 
     */
    setHandler = (client: Petal, handler: (interaction: Interaction) => void): PetalButton => {
        if (this.raw.custom_id) throw new TypeError(`Handler already declared, custom_id present.`);
        if (this.raw.url) throw new TypeError(`Cannot set handler of link button.`)
        this.raw.custom_id = client.interaction_manager.register_interaction(handler, this.raw.individual || null, this.raw.single || false);
        return this;
    }

    /**
     * Gets the buttons raw data
     * @example <PetalButton>.compile();
     * @returns
     */
    compile = (): MessageButton => {

        if (!this.raw.style) this.raw.style = 2;
        if (this.raw.url) this.raw.style = 5;
        if (!this.raw.disabled) this.raw.disabled = false;
        if (!this.raw.emoji) this.raw.emoji = null;
        if (!this.raw.label) this.raw.label = null;

        if (!this.raw.url && !this.raw.custom_id) throw new TypeError(`PetalButton does not have a registered handler.`)
        if (this.raw.custom_id && this.raw.url) throw new TypeError(`PetalButtons cannot have both a URL and a handler.`);

        let button = new MessageButton();
        if (this.raw.url) button.setURL(this.raw.url);
        if (this.raw.label) button.setLabel(this.raw.label);
        if (this.raw.custom_id) button.setCustomId(this.raw.custom_id);

        button.setStyle(this.raw.style);
        button.setDisabled(this.raw.disabled);
        if (this.raw.emoji) button.setEmoji(this.raw.emoji as string);

        return button;

    };

}
