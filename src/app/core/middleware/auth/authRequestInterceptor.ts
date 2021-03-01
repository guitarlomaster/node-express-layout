import {IRequest, IResponse} from "../../../../kernel/types/http";
import {TokenCreator} from "../../../helpers/TokenCreator";
import {User} from "../../models/account/User";

export const authRequestInterceptor = (req: IRequest, res: IResponse, next: any) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];

        if (token) {
            const userData = TokenCreator.parse(req.headers.authorization);

            User.findById(userData.id)
                .then((user) => {
                    if (user && user.signature) {
                        if (user.signature_expires_in && user.signature_expires_in > Date.now()) {
                            const signatureIsValid = TokenCreator.checkSignature(
                                token,
                                user.signature
                            );

                            if (signatureIsValid) {
                                next();
                            } else {
                                User.logout(userData.id);
                                unAuthResponse(res);
                            }
                        } else {
                            expiredResponse(res);
                        }
                    } else {
                        unAuthResponse(res);
                    }
                })
                .catch(() => {
                    unAuthResponse(res);
                });
        } else {
            unAuthResponse(res);
        }
    } else {
        unAuthResponse(res);
    }
};

function expiredResponse(res: IResponse): void {
    res.status(426)
        .json({
            status: "error",
            code: 426,
            message: "Token is expired"
        });
}

function unAuthResponse(res: IResponse): void {
    res.status(401)
        .json({
            status: "error",
            code: 401,
            message: "User is unauthorized"
        });
}
