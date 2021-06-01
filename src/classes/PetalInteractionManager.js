"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PetalInteractionManager = /** @class */ (function () {
    function PetalInteractionManager() {
        var _this = this;
        this.add_interaction = function (handler, custom_id) {
            var id = custom_id || _this.generate_token();
            _this.interactions[id] = handler;
            return id;
        };
        this.handle_interaction = function (interaction) {
            if (!interaction.customID)
                return;
            var handler = _this.interactions[interaction.customID];
            if (handler)
                handler(interaction);
        };
        this.generate_token = function () {
            var token;
            do {
                token = 'petal_xxxxxxxxxx'.replace(/x/g, function () {
                    return Math.floor(Math.random() * 11).toString();
                });
            } while (_this.interactions[token]);
            return token;
        };
        this.interactions = {};
    }
    return PetalInteractionManager;
}());
exports.default = PetalInteractionManager;
//# sourceMappingURL=PetalInteractionManager.js.map