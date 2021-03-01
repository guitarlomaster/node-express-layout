import {Sequelize} from "sequelize";

import {Model} from "./mvc/Model";
import {Env} from "./config/Env";

/**
 * class DBInstanceCreator
 *
 * Initialize instance of Sequelize ORM and pass it to Model
 *
 * @public static createAndSetDatabaseInstance(): void
 * @public static syncDB(): void
 */
export abstract class DBInstanceCreator extends Model {

    public static createAndSetDatabaseInstance(): void {
        const data = Env.getEnv().mysql;
        const db = new Sequelize(data.database, data.username, data.password, {
            dialect: "mysql",
            host: data.host,
            port: data.port,
            define: {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci',
                timestamps: true
            }
        });
        this.setDB(db);
    }

    public static syncDB(): void {
        Model.getDB().sync({force: false})
            .then(() => {
                console.log(`sequelize: DB synchronized successfully.`);
            });
    }

}
