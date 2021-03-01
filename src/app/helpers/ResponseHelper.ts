import {IResponse} from "../../kernel/types/http";

export class ResponseHelper {
    public static successResponse(
        res: IResponse,
        status: number,
        data?: object
    ): void {
        res.status(status)
            .json({
                status: "success",
                ...data
            });
    }

    public static errorResponse(
        res: IResponse,
        status: number,
        code: number,
        message: string,
        data?: object
    ): void {
        res.status(status)
            .json({
                status: "error",
                code: code,
                message: message,
                ...data
            });
    }
}
