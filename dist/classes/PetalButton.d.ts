import { GuildMember, Interaction, MessageButton, User } from "discord.js";
import { Petal } from "..";
export default class PetalButton {
    private raw;
    /**
     * Petal button constructor
     */
    constructor();
    /**
     * Sets the style of the button
     * * The style of link buttons is always grey
     * @param style Buttons style
     * @example <PetalButton>.setStyle('green');
     * @returns
     */
    setStyle: (style: 'blurple' | 'grey' | 'green' | 'red') => PetalButton;
    /**
     * Sets the label of the button
     * @param label Buttons label
     * @example <PetalButton>.setLabel('Petal buttons!');
     * @returns
     */
    setLabel: (label: string) => PetalButton;
    /**
     * Sets the emoji of the button
     * @param emoji Buttons emoji
     * @example <PetalButton>.setEmoji('💖');
     * @returns
     */
    setEmoji: (emoji: string) => PetalButton;
    /**
     * Sets the link of the button
     * * This sets the button to be a link button. All styles will be ignored and handlers will error.
     * @param url Buttons link
     * @example <PetalButton>.setURL('https://github.com/tascord/petal')
     * @returns
     */
    setURL: (url: string) => PetalButton;
    /**
     * Sets the disabled status of the button
     * @param disabled Buttons disabled status
     * @example <PetalButton>.setDisabled(true);
     * @returns
     */
    setDisabled: (disabled: boolean) => PetalButton;
    /**
     * Sets whether the button will cease functionality after initial interaction
     * * Link buttons will cause this to error as they cannot have handlers
     * @param single Button singularity
     * @example <PetalButton>.setSingle(true);
     * @returns
     */
    setSingle: (single: boolean) => PetalButton;
    /**
     * Sets the user who can use the button. If null, anyone can use the button
     * * Link buttons will cause this to error as they cannot have handlers
     * @param individual Button owner if any
     * @example <PetalButton>.setIndividual(message.author);
     * @returns
     */
    setIndividual: (individual: User | GuildMember | null) => PetalButton;
    /**
     * Sets the interaction handler for the button
     * * Link buttons will cause this to error as they cannot have handlers
     * @param handler Button interaction handler
     * @example <PetalButton>.setHandler(petal, (interaction) => interaction.message.delete());
     * @returns
     */
    setHandler: (client: Petal, handler: (interaction: Interaction) => void) => PetalButton;
    /**
     * Gets the buttons raw data
     * @example <PetalButton>.compile();
     * @returns
     */
    compile: () => MessageButton;
}
//# sourceMappingURL=PetalButton.d.ts.map