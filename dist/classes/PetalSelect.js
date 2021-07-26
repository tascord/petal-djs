"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var PetalSelect = /** @class */ (function () {
    /**
     * Petal select constructor
     */
    function PetalSelect() {
        var _this = this;
        /**
         * Sets the placeholder text of the select menu
         * @param text Buttons label
         * @example <PetalSelect>.addOption({ label: 'Select me!!', description: 'A very important option!', value: 'option_1' });
         * @returns
         */
        this.addOption = function () {
            var options = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                options[_i] = arguments[_i];
            }
            _this.raw.options = _this.raw.options.concat(options);
            return _this;
        };
        /**
         * Sets the placeholder text of the select menu
         * @param text Select menu's placeholder text
         * @example <PetalSelect>.setPlaceholder('Select something!');
         * @returns
         */
        this.setPlaceholder = function (text) {
            if (text.length > 80)
                throw new TypeError('Button label length to long. Max 80 characters.');
            _this.raw.placeholder = text;
            return _this;
        };
        /**
         * Sets the disabled status of the select menu
         * @param disabled Select menu's disabled status
         * @example <PetalSelect>.setDisabled(true);
         * @returns
         */
        this.setDisabled = function (disabled) {
            _this.raw.disabled = disabled;
            return _this;
        };
        /**
         * Sets the user who can use the select menu. If null, anyone can use the select menu
         * @param individual Select menu owner if any
         * @example <PetalSelect>.setIndividual(message.author);
         * @returns
         */
        this.setIndividual = function (individual) {
            if (_this.raw.custom_id)
                throw new TypeError("Cannot set individuality after handler is set.");
            _this.raw.individual = individual ? individual.id : undefined;
            return _this;
        };
        /**
         * Sets the interaction handler for the select menu
         * @param handler Select menu interaction handler
         * @example <PetalSelect>.setHandler(petal, (interaction) => ...);
         * @returns
         */
        this.setHandler = function (client, handler) {
            if (_this.raw.custom_id)
                throw new TypeError("Handler already declared, custom_id present.");
            _this.raw.custom_id = client.interaction_manager.register_interaction(handler, _this.raw.individual || null, false);
            return _this;
        };
        /**
         * Gets the select menu's raw data
         * @example <PetalSelect>.compile();
         * @returns
         */
        this.compile = function () {
            if (!_this.raw.disabled)
                _this.raw.disabled = false;
            if (!_this.raw.placeholder)
                _this.raw.placeholder = 'Select an option.';
            var menu = new discord_js_1.MessageSelectMenu();
            if (_this.raw.placeholder)
                menu.setPlaceholder(_this.raw.placeholder);
            if (_this.raw.custom_id)
                menu.setCustomId(_this.raw.custom_id);
            if (_this.raw.min_values)
                menu.setMinValues(_this.raw.min_values);
            if (_this.raw.max_values)
                menu.setMaxValues(_this.raw.max_values);
            menu.setDisabled(menu.disabled);
            menu.addOptions(_this.raw.options);
            return menu;
        };
        this.raw = {
            options: []
        };
    }
    return PetalSelect;
}());
exports.default = PetalSelect;
//# sourceMappingURL=PetalSelect.js.map