import {Model} from "./mvc/Model";
import {modelsRegistry} from "../app/core/models/modelsRegistry";
import {DBInstanceCreator} from "./DBInstanceCreator";

/**
 * class DBInitializer
 *
 * Starts database initiating and registering models tables and relations.
 *
 * @private connectDB(): void
 * @private registerModelsTables(): void
 * @private registerModelsRelations(): void
 * @private syncDB(): void
 */
export class DBInitializer {
    constructor() {
        this.connectDB();
        this.registerModelsTables();
        this.registerModelsRelations();
        this.syncDB();
    }

    private connectDBCalled = false;

    /**
     * Init env and apply database connection.
     */
    private connectDB(): void {
        if (!this.connectDBCalled) {
            DBInstanceCreator.createAndSetDatabaseInstance();
            this.connectDBCalled = true;
        } else {
            throw "Error: DBInitializer's method connectDB has already been called."
        }
    }

    /**
     * Apply models tables.
     */
    private registerModelsTables(): void {
        modelsRegistry.forEach((model: Model) => {
            model.table();
        });
    }

    /**
     * Apply models relations.
     */
    private registerModelsRelations(): void {
        modelsRegistry.forEach((model: Model) => {
            if ("relations" in model) {
                model.relations();
            }
        });
    }

    /**
     * Sync database. It puts applied models to database.
     */
    private syncDB(): void {
        DBInstanceCreator.syncDB();
    }


}
