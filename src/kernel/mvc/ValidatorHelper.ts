import {IResponse} from "../types/http";
import {IValidator} from "../types/validator";

/**
 * class ValidatorHelper
 *
 * @public @static validateRequest(props: any, res: IResponse, validator: IValidator, cb: () => void): void
 * @public @static validateEmail(email: string): boolean
 */
export class ValidatorHelper {

    /**
     * Validate request according to validator: IValidator
     * and response error or pass request forward within callback
     *
     * @param props
     * @param res
     * @param validator
     * @param cb
     */
    public static validateRequest(props: any, res: IResponse, validator: IValidator, cb: () => void): void {
        let clear = true;
        for (const key in validator) {
            if (validator[key].required && !props[key]) {
                res.status(400)
                    .json({
                        status: "error",
                        type: "validation",
                        code: 1104,
                        key: key,
                        message: "required",
                    });
                clear = false;
                break;
            }
            else if (props[key].length >= (validator[key].max_length || 255)) {
                res.status(400)
                    .json({
                        status: "error",
                        type: "validation",
                        code: 1105,
                        key: key,
                        max_length: `${validator[key].max_length || 255}`,
                        message: `max length should be less than ${validator[key].max_length || 255}`
                    });
                clear = false;
                break;
            }
            else if (props[key].length < (validator[key].min_length || 0)) {
                res.status(400)
                    .json({
                        status: "error",
                        type: "validation",
                        code: 1103,
                        key: key,
                        min_length: `${validator[key].max_length || 255}`,
                        message: `min length should be more than ${validator[key].min_length || 0}`
                    });
                clear = false;
                break;
            } else if (validator[key].email) {
                if (!this.validateEmail(props[key])) {
                    res.status(400)
                        .json({
                            status: "error",
                            type: "validation",
                            code: 1102,
                            key: key,
                            message: `is not valid`
                        });
                    clear = false;
                    break;
                }
            }
        }
        if (clear) {
            cb();
        }
    }

    /**
     * Email validation function.
     *
     * @param email
     */
    public static validateEmail(email: string): boolean {
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reg.test(String(email).toLowerCase());
    }

}
