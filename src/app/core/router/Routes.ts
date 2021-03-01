import {Router} from "../../../kernel/mvc/Router";
import {LoginController} from "../controllers/auth/LoginController";
import {RegisterController} from "../controllers/auth/RegisterController";
import {AccountController} from "../controllers/auth/AccountController";
import {authRequestInterceptor} from "../middleware/auth/authRequestInterceptor";
import {RefreshController} from "../controllers/auth/RefreshController";

/**
 * Routes
 *
 * Extends Router to have access to express instance
 *
 * @public register(): void
 */
export class Routes extends Router {

    /**
     * Registers routes
     */
    public register(): void {
        this.route.get("/", (req, res) => {
            res.send("Page not found!!!");
        });

        /**
         * Authorization
         */
        this.post("/api/register", new RegisterController());
        this.post("/api/login", new LoginController());
        this.get("/api/account", new AccountController(), {
            middleware: [authRequestInterceptor]
        });
        this.post("/api/refresh", new RefreshController());

    }

}
