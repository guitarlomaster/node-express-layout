import {Controller} from "../../../../kernel/mvc/Controller";
import {User} from "../../models/account/User";
import {IRequest, IResponse} from "../../../../kernel/types/http";
import {TokenCreator} from "../../../helpers/TokenCreator";
import {ResponseHelper} from "../../../helpers/ResponseHelper";

export class AccountController extends Controller {

    public async index(req: IRequest, res: IResponse): Promise<void> {
        const userData = TokenCreator.parse(req.headers.authorization);

        try {
            const account = await User.getAccountData(userData.id);

            if (account) {
                const user: any = {
                    email: account.email,
                    name: account.name,
                    role: account.role,
                };
                if (account.surname) {
                    user.surname = account.surname;
                }
                if (account.birth_date) {
                    user.birth_date = account.birth_date;
                }
                if (account.photo) {
                    user.photo = account.photo;
                }
                if (account.photo_miniature) {
                    user.photo_miniature = account.photo_miniature;
                }
                if (account.about) {
                    user.about = account.about;
                }
                if (account.email_confirmed) {
                    user.email_confirmed = account.about;
                }
                ResponseHelper.successResponse(res, 200, {user});
            } else {
                ResponseHelper.errorResponse(res, 401, 401,"User is not found");
            }
        }
        catch (err) {
            ResponseHelper.errorResponse(res, 401, 401, "User is unauthorized");
        }
    }

}
