import {Controller} from "../../../../kernel/mvc/Controller";
import {IRequest, IResponse} from "../../../../kernel/types/http";
import {TokenCreator} from "../../../helpers/TokenCreator";
import {User} from "../../models/account/User";
import {Env} from "../../../../kernel/config/Env";
import {ResponseHelper} from "../../../helpers/ResponseHelper";

export class RefreshController extends Controller {

    public async index(req: IRequest, res: IResponse): Promise<void> {
        const accessToken = req.body.access_token;
        const refreshToken = req.body.refresh_token;
        const env = Env.getEnv();

        const userData = TokenCreator.parse("Bearer " + accessToken);

        try {
            const user = await User.findById(userData.id);
            const signatureIsValid = TokenCreator.checkSignature(
                accessToken,
                user?.signature || env.app_key
            );

            if (user && signatureIsValid && user.refresh_token === refreshToken) {
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
                ResponseHelper.errorResponse(res, 401, 401, "Invalid token");
            }
        }
        catch (err) {
            ResponseHelper.errorResponse(res, 401, 401, "User is unauthorized");
        }
    }

}
