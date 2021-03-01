import {Request as Req, Response as Res} from "express-serve-static-core";

export interface IRequest extends Req {}
export interface IResponse extends Res {}

