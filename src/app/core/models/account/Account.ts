import {STRING, INTEGER, BOOLEAN} from "sequelize";

import {Model, ModelCtor} from "../../../../kernel/mvc/Model";

let model: ModelCtor;

export class Account extends Model {

    public table(): void {
        model = Account.getDB().define("account", {
            id: {
                type: INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            name: STRING,
            surname: STRING,
            birth_date: STRING,
            photo: STRING,
            photo_miniature: STRING,
            about: STRING,
            email_confirmed: {
                type: BOOLEAN,
                defaultValue: false
            }
        });
    }

    public static getModel(): ModelCtor {
        return model;
    }

}
