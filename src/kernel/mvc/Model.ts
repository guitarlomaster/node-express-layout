import {Sequelize, ModelCtor as _ModelCtor} from "sequelize";

export interface ModelCtor extends _ModelCtor<any> {
    [p: string]: any;
}

let database: Sequelize;

/**
 * abstract class Model
 *
 * Superclass for models.
 *
 * @public @abstract table(): void
 * @public relations(): void
 * @protected @static setDB(db: Sequelize): void
 * @public @static getDB(): Sequelize
 */
export abstract class Model {

    /**
     * Must be declared in child classes.
     */
    public abstract table(): void;
    public relations(): void {}

    /**
     * Called to set database instance.
     * @param db
     */
    protected static setDB(db: Sequelize): void {
        if (!database) {
            database = db;
        } else {
            throw "Error: Database has already been set in Model."
        }
    }

    /**
     * Returns database instance.
     */
    protected static getDB(): Sequelize {
        return database;
    }

}
