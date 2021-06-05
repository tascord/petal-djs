"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var constants_1 = __importDefault(require("../constants"));
var PetalButton = /** @class */ (function () {
    /**
     * Petal button constructor
     */
    function PetalButton() {
        var _this = this;
        /**
         * Sets the style of the button
         * * The style of link buttons is always grey
         * @param style Buttons style
         * @example <PetalButton>.setStyle('green');
         * @returns
         */
        this.setStyle = function (style) {
            _this.raw.style = style == 'blurple' ? 1 : style == 'grey' ? 2 : style == 'green' ? 3 : 4;
            return _this;
        };
        /**
         * Sets the label of the button
         * @param label Buttons label
         * @example <PetalButton>.setLabel('Petal buttons!');
         * @returns
         */
        this.setLabel = function (label) {
            if (label.length > 80)
                throw new TypeError('Button label length to long. Max 80 characters.');
            _this.raw.label = label;
            return _this;
        };
        /**
         * Sets the emoji of the button
         * @param emoji Buttons emoji
         * @example <PetalButton>.setEmoji('💖');
         * @returns
         */
        this.setEmoji = function (emoji) {
            if (!constants_1.default.emoji_regex.test(emoji))
                throw new TypeError('Invalid emoji. Fails RGI Regex');
            _this.raw.emoji = emoji;
            return _this;
        };
        /**
         * Sets the link of the button
         * * This sets the button to be a link button. All styles will be ignored and handlers will error.
         * @param url Buttons link
         * @example <PetalButton>.setURL('https://github.com/tascord/petal')
         * @returns
         */
        this.setURL = function (url) {
            _this.raw.url = url;
            return _this;
        };
        /**
         * Sets the disabled status of the button
         * @param disabled Buttons disabled status
         * @example <PetalButton>.setDisabled(true);
         * @returns
         */
        this.setDisabled = function (disabled) {
            _this.raw.disabled = disabled;
            return _this;
        };
        /**
         * Sets whether the button will cease functionality after initial interaction
         * * Link buttons will cause this to error as they cannot have handlers
         * @param single Button singularity
         * @example <PetalButton>.setSingle(true);
         * @returns
         */
        this.setSingle = function (single) {
            if (_this.raw.url)
                throw new TypeError("Cannot set singularity of link button.");
            if (_this.raw.custom_id)
                throw new TypeError("Cannot set singularity after handler is set.");
            _this.raw.single = single;
            return _this;
        };
        /**
         * Sets the user who can use the button. If null, anyone can use the button
         * * Link buttons will cause this to error as they cannot have handlers
         * @param individual Button owner if any
         * @example <PetalButton>.setIndividual(message.author);
         * @returns
         */
        this.setIndividual = function (individual) {
            if (_this.raw.url)
                throw new TypeError("Cannot set individuality of link button.");
            if (_this.raw.custom_id)
                throw new TypeError("Cannot set individuality after handler is set.");
            _this.raw.individual = individual ? individual.id : undefined;
            return _this;
        };
        /**
         * Sets the interaction handler for the button
         * * Link buttons will cause this to error as they cannot have handlers
         * @param handler Button interaction handler
         * @example <PetalButton>.setHandler(petal, (interaction) => interaction.message.delete());
         * @returns
         */
        this.setHandler = function (client, handler) {
            if (_this.raw.custom_id)
                throw new TypeError("Handler already declared, custom_id present.");
            if (_this.raw.url)
                throw new TypeError("Cannot set handler of link button.");
            _this.raw.custom_id = client.interaction_manager.register_interaction(handler, _this.raw.individual || null, _this.raw.single || false);
            return _this;
        };
        /**
         * Gets the buttons raw data
         * @example <PetalButton>.compile();
         * @returns
         */
        this.compile = function () {
            if (!_this.raw.style)
                _this.raw.style = 2;
            if (_this.raw.url)
                _this.raw.style = 5;
            if (!_this.raw.disabled)
                _this.raw.disabled = false;
            if (!_this.raw.emoji)
                _this.raw.emoji = null;
            if (!_this.raw.label)
                _this.raw.label = null;
            if (!_this.raw.url && !_this.raw.custom_id)
                throw new TypeError("PetalButton does not have a registered handler.");
            if (_this.raw.custom_id && _this.raw.url)
                throw new TypeError("PetalButtons cannot have both a URL and a handler.");
            var button = new discord_js_1.MessageButton();
            if (_this.raw.url)
                button.setURL(_this.raw.url);
            if (_this.raw.label)
                button.setLabel(_this.raw.label);
            if (_this.raw.custom_id)
                button.setCustomID(_this.raw.custom_id);
            button.setStyle(_this.raw.style);
            button.setDisabled(_this.raw.disabled);
            if (_this.raw.emoji)
                button.setEmoji(_this.raw.emoji);
            return button;
        };
        this.raw = {
            type: 2
        };
    }
    return PetalButton;
}());
exports.default = PetalButton;
//# sourceMappingURL=PetalButton.js.map