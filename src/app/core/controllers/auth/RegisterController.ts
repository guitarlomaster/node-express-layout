import {Controller} from "../../../../kernel/mvc/Controller";
import {IRequest, IResponse} from "../../../../kernel/types/http";
import {User} from "../../models/account/User";
import {Bcrypt} from "../../../helpers/Bcrypt";
import {IValidator} from "../../../../kernel/types/validator";
import {TokenCreator} from "../../../helpers/TokenCreator";
import {Env} from "../../../../kernel/config/Env";
import {ResponseHelper} from "../../../helpers/ResponseHelper";

export class RegisterController extends Controller {

    public validator: IValidator = {
        email: {
            email: true,
            required: true
        },
        password: {
            required: true,
            min_length: 4
        }
    };

    public async index(req: IRequest, res: IResponse): Promise<void> {
        const credentials = await TokenCreator.generateTokensCredentials();
        const passwordHash = await Bcrypt.hash(req.body.password);
        const env = Env.getEnv();

        try {
            const user = await User.create(
                req.body.email,
                passwordHash,
                credentials.tokens.signature,
                credentials.tokens.refresh_token,
                credentials.expire_time.signature_expires_in,
                credentials.expire_time.refresh_token_expires_in
            );

            if (user) {
                const jwt = TokenCreator.generateJWT({id: user.id}, user.signature || env.app_key);

                ResponseHelper.successResponse(res, 200, {
                    access_token: jwt,
                    refresh_token: user.refresh_token
                });
            } else {
                ResponseHelper.errorResponse(res, 520, 0, "Unknown error");
            }
        } catch (err) {
            ResponseHelper.errorResponse(res, 422, err.parent.errno, err.errors[0].message);
        }
    }

}
