import {Express} from "express-serve-static-core";
import {DBInitializer} from "./DBInitializer";

/**
 * class Server
 *
 * @private app: Express
 * @public listen(port: number)
 */
export class Server {

    constructor(app: Express) {
        this.app = app;
    }

    private app: Express;

    /**
     * Starts server
     * @param port
     */
    public listen(port: number): void {
        this.app.listen(port, () => {
            new DBInitializer();
            console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
        });
    }

}
