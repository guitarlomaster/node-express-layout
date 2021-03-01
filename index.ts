import express from "express";

import {Middleware} from "./src/kernel/Middleware";
import {Routes} from "./src/app/core/router/Routes";
import {Server} from "./src/kernel/Server";
import {Env} from "./src/kernel/config/Env";

Env.init();
const env = Env.getEnv();

const app = express();
const middleware = new Middleware(app);
const routes = new Routes(app);
const server = new Server(app);

middleware.apply();
routes.register();

server.listen(env.port);
