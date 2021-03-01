import {readFileSync} from "fs";
import {resolve} from "path";

import {EnvModel} from "./env.model";

let env: any;

/**
 * abstract class Env
 *
 * Gets env object from env.json and stores it.
 */
export abstract class Env {

    /**
     * Parses to json and gives env data.
     */
    public static getEnv(): EnvModel {
        return JSON.parse(env);
    }

    /**
     * Sets env.json contents to env as a string.
     */
    public static init(): void {
        env = readFileSync(resolve(__dirname, "../../../env.json"), {encoding: "utf8"});
    }
}
