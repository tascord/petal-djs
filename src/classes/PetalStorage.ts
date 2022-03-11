import { join } from 'path';
import Hasty, { Hastyable } from 'hasty.db';

/**
 * Get hasty.db database
 * @param table_name Table name 
 * @param database_location Database location
 * @returns 
 */
export const get_database = (table_name: string, database_location: string = join('./', 'petal.sqlite')): Hastyable => {

    const base = Hasty(database_location);
    return new base.Table(table_name);

}

/**
 * Gets all stores from a database
 * @param database hasty.db table
 * @returns
 */
export const get_all_database_values = (database: Hastyable): { [key: string]: any } => {

    return database.all().map(raw => database.get(raw.ID));

}

export class Store {

    database: Hastyable;
    id: string;

    /**
     * PetalStorage constructor
     * @param database hasty.db table or table name
     * @param database_location Database location
     * @param id Table row ID 
     */
    constructor(database: Hastyable | string, id: string, database_location = join('./', 'petal.sqlite')) {

        if (typeof(database) === 'string') this.database = get_database(database, database_location);
        else this.database = database;

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