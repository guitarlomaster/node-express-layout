import {STRING, BIGINT, INTEGER} from "sequelize";

import {Model} from "../../../../kernel/mvc/Model";
import {IAccount, IUserModel} from "../../../types/user";
import {Account} from "./Account";
import {ModelCtor} from '../../../../kernel/mvc/Model';

interface IUpdateCredentialsObj {
    signature: string;
    refresh_token: string;
    signature_expires_in: number;
    refresh_token_expires_in: number;
}

let model: ModelCtor;

export class User extends Model {

    public table() {
        model = User.getDB().define("user", {
            id: {
                type: INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            email: {
                type: STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: STRING,
                allowNull: false
            },
            role: {
                type: STRING,
                allowNull: false,
                defaultValue: "user"
            },
            signature: STRING,
            signature_expires_in: BIGINT,
            refresh_token: STRING,
            refresh_token_expires_in: BIGINT,
        });
    }

    public static async create(
        email: string,
        password: string,
        signature: string,
        refresh_token: string,
        signature_expires_in: number,
        refresh_token_expires_in: number
    ): Promise<IUserModel | undefined> {
        const user = await model.create({
            email,
            password,
            signature,
            refresh_token,
            signature_expires_in,
            refresh_token_expires_in
        });
        const account = await Account.getModel().create({
            name: "user" + user.get().id
        });
        user.setAccount(account);
        return user.get();
    }

    public static async updateCredentials(id: number, options: IUpdateCredentialsObj): Promise<IUserModel | undefined> {
        const user = await model.findByPk(id);
        user?.update(options);
        return user;
    }

    public static async findByEmail(email: string): Promise<IUserModel | undefined> {
        const user = await model.findOne({
            where: { email }
        });
        return user?.get();
    }

    public static async findById(id: number): Promise<IUserModel | undefined> {
        const user = await model.findByPk(id);
        return user?.get();
    }

    public static async getAccountData(id: number): Promise<IAccount | undefined> {
        const _user = await model.findByPk(id);
        if (!_user) {
            return undefined;
        }
        const _account = await _user.getAccount();
        const user: IUserModel = _user.get();
        const account = _account?.get();

        return {
            email: user.email,
            name: account.name,
            role: user.role === "admin" ? "user" : user.role,
            surname: account.surname,
            birth_date: account.birth_date,
            photo: account.photo,
            photo_miniature: account.photo_miniature,
            about: account.about,
            email_confirmed: account.email_confirmed
        }
    }

    public static async logout(id: number): Promise<void> {
        const user = await model.findByPk(id);
        user?.update({
            signature: null,
            signature_expires_in: null,
            refresh_token: null,
            refresh_token_expires_in: null
        });
    }

    public static getModel(): ModelCtor {
        return model;
    }

    public relations(): void {
        model.hasOne(Account.getModel(), {onDelete: "cascade"});
    }

}
