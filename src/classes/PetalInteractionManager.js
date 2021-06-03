"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var PetalInteractionManager = /** @class */ (function () {
    /**
     * InteractionManager constructor
     */
    function PetalInteractionManager() {
        var _this = this;
        /**
         * Registers an interaction
         * @param handler
         * @param custom_id
         * @returns
         */
        this.register_interaction = function (handler, linked_user, single, custom_id) {
            var id = custom_id || _this.generate_token();
            _this.interactions[id] = {
                handler: handler,
                linked_user: linked_user,
                single: single,
                registered: Date.now()
            };
            return id;
        };
        /**
         * Handles an interaction
         * @param interaction Interaction data
         */
        this.handle_interaction = function (interaction) {
            if (!interaction.customID) {
                // Handle action if un-registered
                if (interaction.deferUpdate)
                    interaction.deferUpdate();
                return;
            }
            ;
            var data = _this.interactions[interaction.customID];
            if (!data)
                return interaction.deferUpdate();
            if (data.linked_user ? data.linked_user != interaction.user.id : false)
                return interaction.deferUpdate();
            data.handler(interaction);
            if (data.single)
                delete _this.interactions[interaction.customID];
        };
        /**
         * Generates an unused token (custom_id)
         * @returns Unused token
         */
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
        setInterval(function () {
            var e_1, _a;
            try {
                for (var _b = __values(Object.entries(_this.interactions)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                    var registered = value.registered;
                    if (!registered) {
                        console.warn("No registered time for " + key + ".");
                        continue;
                    }
                    if (Date.now() - registered > (5 * 60 * 1000))
                        delete _this.interactions[key];
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }, 30 * 1000);
    }
    return PetalInteractionManager;
}());
exports.default = PetalInteractionManager;
//# sourceMappingURL=PetalInteractionManager.js.map