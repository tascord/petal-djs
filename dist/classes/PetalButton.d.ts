import { GuildMember, MessageButton, User } from "discord.js";
import { Petal } from "..";
export default class PetalButton {
    private raw;
    /**
     * Petal button constructor
     */
    constructor();
    /**
     * Sets the style of the button
     * @param style Buttons style
     */
    setStyle: (style: 'blurple' | 'grey' | 'green' | 'red') => PetalButton;
    /**
     * Sets the label of the button
     * @param label Buttons label
     */
    setLabel: (label: string) => PetalButton;
    /**
     * Sets the emoji of the button
     * @param emoji Buttons emoji
     */
    setEmoji: (emoji: string) => PetalButton;
    /**
     * Sets the link of the button
     * @param url Buttons link
     */
    setURL: (url: string) => PetalButton;
    /**
     * Sets the disabled status of the button
     * @param disabled Buttons disabled status
     */
    setDisabled: (disabled: boolean) => PetalButton;
    /**
     * Sets the interaction handler for the button
     * @param handler Button interaction handler
     * @returns
     */
    setHandler: (client: Petal, handler: Function) => PetalButton;
    /**
     * Sets whether the button will cease functionality after initial interaction
     * @param single Button singularity
     * @returns
     */
    setSingle: (single: boolean) => PetalButton;
    /**
     * Sets whether or not anyone can use the button or only the user who ran the command
     * @param individual Button individuality
     * @returns
     */
    setIndividual: (individual: User | GuildMember) => PetalButton;
    /**
     * Gets the buttons raw data
     * @returns
     */
    compile: () => MessageButton;
}
//# sourceMappingURL=PetalButton.d.ts.map