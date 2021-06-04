"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PetalEvent = /** @class */ (function () {
    function PetalEvent() {
    }
    /**
     * Event run function
     * @param petal Petal instance
     * @param args Event arguments
     */
    PetalEvent.prototype.run = function (petal) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        ;
    };
    ;
    return PetalEvent;
}());
exports.default = PetalEvent;
//# sourceMappingURL=PetalEvent.js.map