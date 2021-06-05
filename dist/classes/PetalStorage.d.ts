import { table } from 'quick.db';
/**
 * Get quick.db database
 * @param table_name Table name
 * @param database_location Database location
 * @returns
 */
export declare const get_database: (table_name: string, database_location?: string) => table;
/**
 * Gets all stores from a database
 * @param database Quick.db table
 * @returns
 */
export declare const get_all_database_values: (database: table) => {
    [key: string]: any;
};
export declare class Store {
    database: table;
    id: string;
    base: any;
    /**
     * PetalStorage constructor
     * @param database Quick.db table
     * @param database_location Database location
     * @param id Table row ID
     */
    constructor(database: table, id: string, database_location?: string);
    /**
     * Get a value from a store
     * @param key Sub value key
     * @returns
     */
    get(key?: string): any;
    /**
     * Set a value from a store
     * @param key Sub value key
     * @param value New value
     */
    set(key: string, value: any): void;
    /**
     * Overwrite all values of a store
     * @param value New value
     */
    set_all(value: object): void;
}
//# sourceMappingURL=PetalStorage.d.ts.map