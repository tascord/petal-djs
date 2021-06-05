import { join } from 'path';
import { table } from 'quick.db';
const quick = require('quick.db');

/**
 * Get quick.db database
 * @param table_name Table name 
 * @param database_location Database location
 * @returns 
 */
export const get_database = (table_name: string, database_location: string = join('./', 'petal.sqlite')): table => {

    const base = quick(database_location);
    return new base.table(table_name);

}

/**
 * Gets all stores from a database
 * @param database Quick.db table
 * @returns
 */
export const get_all_database_values = (database: table): {[key: string]: any} => {

    return database.all().map(raw => database.get(raw.ID));

}

export class Store {

    database: table;
    id: string;
    base: any; // Bruh

    /**
     * PetalStorage constructor
     * @param database Quick.db table
     * @param database_location Database location
     * @param id Table row ID 
     */
    constructor(database: table, id: string, database_location: string = join('./', 'petal.sqlite')) {

        this.database = database;
        this.id = id;

    }

    /**
     * Get a value from a store
     * @param key Sub value key
     * @returns 
     */
    get(key?: string): any {

        if (!this.database.has(this.id)) this.database.set(this.id, {});
        return this.database.get(this.id + (key ? `.${key}` : ''));

    }

    /**
     * Set a value from a store
     * @param key Sub value key
     * @param value New value
     */
    set(key: string, value: any): void {

        if (!this.database.has(this.id)) this.database.set(this.id, {});
        this.database.set(`${this.id}.${key}`, value);

    }

    /**
     * Overwrite all values of a store
     * @param value New value
     */
    set_all(value: object): void {

        this.database.set(this.id, value);

    }


}