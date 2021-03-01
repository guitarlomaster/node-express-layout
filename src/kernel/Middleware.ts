import {Express} from "express-serve-static-core";
import cors from "cors";

import middlewareRegistry from "../app/core/middleware/middlewareRegistry";
import {Env} from "./config/Env";
import logger from "morgan";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

/**
 * class Middleware
 *
 * @private app
 * @private middlewareRegistry
 * @protected addToList(middleware: any[]): void
 * @protected register(): void
 * @public apply(): void
 */
export class Middleware {

    constructor(app: Express) {
        this.app = app;
    }

    /**
     * Express instance passed through constructor
     */
    private app: Express;
    /**
     * Middleware list to be registered
     */
    private middlewareList: any[] = [];

    /**
     * Sets middlewareRegistry immutably
     * @param middleware
     */
    private addToList(middleware: any[]): void {
        const clientUrl = Env.getEnv().origin_urls.client;

        this.middlewareList = [
            logger("dev"),
            express.urlencoded({ extended: false }),
            cookieParser(),
            express.static(path.join(__dirname, "../../assets")),
            express.json(),
            cors({
                origin: [clientUrl, "http://localhost:3001"],
                allowedHeaders: ["X-Requested-With", "Content-Type", "Authorization"]
            }),
            ...middleware,
        ];
    }

    /**
     * Applies each middleware in middlewareRegistry to "app" property
     */
    private register(): void {
        this.middlewareList.forEach(middleware => {
            this.app.use(middleware);
        });
    }

    /**
     * Initiate middleware application process
     */
    public apply(): void {
        this.addToList(middlewareRegistry);
        this.register();
    }
}
