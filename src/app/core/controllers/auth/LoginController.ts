import {Controller} from "../../../../kernel/mvc/Controller";
import {IRequest, IResponse} from "../../../../kernel/types/http";
import {IValidator} from "../../../../kernel/types/validator";
import {User} from "../../models/account/User";
import {Bcrypt} from "../../../helpers/Bcrypt";
import {TokenCreator} from "../../../helpers/TokenCreator";
import {Env} from "../../../../kernel/config/Env";
import {ResponseHelper} from "../../../helpers/ResponseHelper";

export class LoginController extends Controller {

    public validator: IValidator = {
        email: {
            email: true,
            required: true
        },
        password: {
            required: true
        }
    };

    public async index(req: IRequest, res: IResponse): Promise<void> {
        try {
            const user = await User.findByEmail(req.body.email);

            if (user) {
                const passwordIsTruthy = await Bcrypt.compare(req.body.password, user.password);

                if (passwordIsTruthy) {
                    const credentials = await TokenCreator.generateTokensCredentials();
                    const updatedUser = await User.updateCredentials(user.id, {
                        signature: credentials.tokens.signature,
                        refresh_token: credentials.tokens.refresh_token,
                        signature_expires_in: credentials.expire_time.signature_expires_in,
                        refresh_token_expires_in: credentials.expire_time.refresh_token_expires_in
                    });
                    const env = Env.getEnv();
                    const jwt = TokenCreator.generateJWT({id: user.id}, updatedUser?.signature || env.app_key);

                    ResponseHelper.successResponse(res, 200, {
                        access_token: jwt,
                        refresh_token: updatedUser?.refresh_token
                    });
                } else {
                    ResponseHelper.errorResponse(res, 401, 1043, "Password is not correct");
                }
            } else {
                ResponseHelper.errorResponse(res, 401, 1044, "Email is not found");
            }
        }
        catch (err) {
            ResponseHelper.errorResponse(res, 400, err.parent.errno, err.errors[0].message);
        }
    }
}
