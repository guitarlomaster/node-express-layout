import {Express} from "express-serve-static-core";
import {Controller} from "./Controller";
import {IRequest, IResponse} from "../types/http";
import {parse} from "url";
import {ValidatorHelper} from "./ValidatorHelper";

interface IRequestProps {
    method: "get" | "post" | "put" | "patch" | "delete",
    path: string,
    controller: Controller,
    extra?: IMethodExtraData
}

interface IResponseToControllerProps {
    requestMethod: string,
    path: string;
    req: IRequest,
    res: IResponse,
    controller: Controller | any,
    controllerMethodName?: string;
}

interface IPerformValidationProps {
    method: string,
    req: IRequest,
    res: IResponse,
    controller: Controller,
}

interface IMethodExtraData {
    controllerMethodName?: string;
    middleware?: any[]
}

/**
 * abstract class Router
 *
 * Superclass for Routes class.
 *
 * @private app: Express
 * @protected route: Express
 * @protected get(): void
 * @protected post(): void
 * @protected put(): void
 * @protected patch(): void
 * @protected delete(): void
 * @private request
 * @private responseToController(): void
 * @private performValidation(): void
 */
export abstract class Router {

    constructor(app: Express) {
        this.app = app;
    }

    /**
     * Express instance passed through constructor
     */
    private app: Express;

    /**
     * Getter to give access to "app" property
     */
    protected get route(): Express {
        return this.app;
    }

    protected get(path: string, controller: Controller, extra?: IMethodExtraData): void {
        this.request({method: "get", path, controller, extra});
    }

    protected post(path: string, controller: Controller, extra?: IMethodExtraData): void {
        this.request({method: "post", path, controller, extra});
    }

    protected put(path: string, controller: Controller, extra?: IMethodExtraData): void {
        this.request({method: "put", path, controller, extra});
    }

    protected patch(path: string, controller: Controller, extra?: IMethodExtraData): void {
        this.request({method: "patch", path, controller, extra});
    }

    protected delete(path: string, controller: Controller, extra?: IMethodExtraData): void {
        this.request({method: "delete", path, controller, extra});
    }

    /**
     * Common method for different requests
     * @param props: IRequestProps
     */
    private request(props: IRequestProps): void {
        const {method, path, controller, extra} = props;
        const middleware: any[] = extra?.middleware ? extra.middleware : [];

        this.app[method](path, ...middleware, (req, res) => {
            this.responseToControllerHandler({
                requestMethod: method,
                path,
                controller,
                controllerMethodName: extra?.controllerMethodName,
                req,
                res
            });
        });
    }

    /**
     * Defines method of the controller to address to, or shows error.
     * @param props: IResponseToControllerProps
     */
    private responseToControllerHandler(props: IResponseToControllerProps): void {
        const {requestMethod, path, controllerMethodName, controller, req, res} = props;

        this.performValidation(
            {
                method: requestMethod,
                req,
                res,
                controller
            },
            () => {
                if (controllerMethodName) {
                    if (controllerMethodName in controller) {
                        controller[controllerMethodName](req, res);
                    } else {
                        res.json({
                            message: `Error in route: ${path}. There is no #${controllerMethodName} method in ${controller.constructor.name}`
                        });
                    }
                } else {
                    if ("index" in controller) {
                        controller.index(req, res);
                    } else {
                        res.json({
                            message: `Error in route: ${path}. There is no #index method in ${controller.constructor.name}`
                        });
                    }
                }
            }
        );
    }

    /**
     * Check validator prop of a controller, and choose props to pass to validator
     *
     * @param props: IPerformValidationProps
     * @param cb: () => void
     */
    private performValidation(props: IPerformValidationProps, cb: () => void): void {
        const {method, req, res, controller} = props;

        if (controller.validator && Object.keys(controller.validator).length) {
            if (method === "get") {
                const params = parse(req.url, true).query;
                ValidatorHelper.validateRequest(params, res, controller.validator, cb);
            } else {
                ValidatorHelper.validateRequest(req.body, res, controller.validator, cb);
            }
        } else {
            cb();
        }
    }

}
