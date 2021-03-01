import {Model} from "../../../kernel/mvc/Model";
import {User} from "./account/User";
import {Account} from "./account/Account";

/**
 * Models which tables will be created
 */
export const modelsRegistry: Model[] = [
    new User(),
    new Account(),
];
