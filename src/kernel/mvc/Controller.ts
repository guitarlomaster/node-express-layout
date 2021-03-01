import {IRequest, IResponse} from "../types/http";
import {IValidator} from "../types/validator";

/**
 * class Controller
 *
 * Required superclass for controllers
 *
 * @public index(req: IRequest, res: IResponse): any
 */
export abstract class Controller {
    constructor() {
    }

    public validator: IValidator = {};

    /**
     * Method to which router addresses by default
     * @param req
     * @param res
     */
    public index(req: IRequest, res: IResponse): void {}
}
