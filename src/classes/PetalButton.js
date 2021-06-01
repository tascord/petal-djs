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
         * @param style Buttons style
         */
        this.setStyle = function (style) {
            _this.raw.style = style == 'blurple' ? 1 : style == 'grey' ? 2 : style == 'green' ? 3 : 4;
            return _this;
        };
        /**
         * Sets the label of the button
         * @param label Buttons label
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
         */
        this.setEmoji = function (emoji) {
            if (!constants_1.default.emoji_regex.test(emoji))
                throw new TypeError('Invalid emoji. Fails RGI Regex');
            _this.raw.emoji = emoji;
            return _this;
        };
        /**
         * Sets the link of the button
         * @param url Buttons link
         */
        this.setURL = function (url) {
            _this.raw.url = url;
            return _this;
        };
        /**
         * Sets the disabled status of the button
         * @param disabled Buttons disabled status
         */
        this.setDisabled = function (disabled) {
            _this.raw.disabled = disabled;
            return _this;
        };
        /**
         * Sets the interaction handler for the button
         * @param handler Button interaction handler
         * @returns
         */
        this.setHandler = function (client, handler) {
            if (_this.raw.custom_id)
                throw new TypeError("Handler already declared, custom_id present.");
            _this.raw.custom_id = client.interaction_manager.add_interaction(handler);
            return _this;
        };
        /**
         * Gets the buttons raw data
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