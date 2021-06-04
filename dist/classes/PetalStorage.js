"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = exports.get_database = void 0;
var path_1 = require("path");
var quick = require('quick.db');
/**
 * Get quick.db database
 * @param table_name Table name
 * @param database_location Database location
 * @returns
 */
var get_database = function (table_name, database_location) {
    if (database_location === void 0) { database_location = path_1.join('./', 'petal.sqlite'); }
    var base = quick(database_location);
    return new base.table(table_name);
};
exports.get_database = get_database;
var Store = /** @class */ (function () {
    /**
     * PetalStorage constructor
     * @param database Quick.db table
     * @param database_location Database location
     * @param id Table row ID
     */
    function Store(database, id, database_location) {
        if (database_location === void 0) { database_location = path_1.join('./', 'petal.sqlite'); }
        this.database = database;
        this.id = id;
    }
    /**
     * Get a value from a store
     * @param key Sub value key
     * @returns
     */
    Store.prototype.get = function (key) {
        if (!this.database.has(this.id))
            this.database.set(this.id, {});
        return this.database.get(this.id + (key ? "." + key : ''));
    };
    /**
     * Set a value from a store
     * @param key Sub value key
     * @param value New value
     */
    Store.prototype.set = function (key, value) {
        if (!this.database.has(this.id))
            this.database.set(this.id, {});
        this.database.set(this.id + "." + key, value);
    };
    /**
     * Overwrite all values of a store
     * @param value New value
     */
    Store.prototype.set_all = function (value) {
        this.database.set(this.id, value);
    };
    return Store;
}());
exports.Store = Store;
//# sourceMappingURL=PetalStorage.js.map