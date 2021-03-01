import crypto from "crypto";
import {Bcrypt} from "./Bcrypt";

interface UserJWT {
    id: number;
}

interface ExpireTime {
    signature_expires_in: number;
    refresh_token_expires_in: number;
}

interface Tokens {
    signature: string;
    refresh_token: string;
}

export class TokenCreator {

    public static parse(token: string | undefined): UserJWT {
        let tokenParts = token ? token.split(' ')[1].split('.') : [];
        return JSON.parse(Buffer.from(tokenParts[1], "base64").toString("utf8")) as UserJWT;
    }

    public static generateToken(hash: string): string {
        return crypto
            .createHmac("SHA256", hash)
            .update(`${Math.random()}`)
            .digest("base64");
    }

    public static generateJWT(user: UserJWT, key: string): string {
        const head = Buffer.from(JSON.stringify({alg: "HS256", typ: "jwt"})).toString("base64");
        const body = Buffer.from(JSON.stringify(user)).toString("base64");

        const signature = crypto
            .createHmac("SHA256", key)
            .update(`${head}.${body}`)
            .digest("base64");

        return `${head}.${body}.${signature}`;
    }

    public static checkSignature(token: string, key: string): boolean {
        const tokenParts = token.split('.');

        const signature = crypto
            .createHmac("SHA256", key)
            .update(`${tokenParts[0]}.${tokenParts[1]}`)
            .digest("base64");

        return signature === tokenParts[2];
    }

    public static getExpireTime(): ExpireTime {
        const now = Date.now();
        return {
            signature_expires_in: now + (300 * 1000), // 5 minutes
            refresh_token_expires_in: now + (3600 * 24 * 30 * 1000) // 30 days
        };
    }

    public static async generateTokensCredentials(): Promise<{tokens: Tokens, expire_time: ExpireTime}> {
        const signatureHash = await Bcrypt.hash(`${Math.random()}`);
        const signature = TokenCreator.generateToken(signatureHash);

        const refreshTokenHash = await Bcrypt.hash(`${Math.random()}`);
        const refreshToken = TokenCreator.generateToken(refreshTokenHash);

        const {signature_expires_in, refresh_token_expires_in} = TokenCreator.getExpireTime();

        return {
            tokens: {
                signature: signature,
                refresh_token: refreshToken
            },
            expire_time: {
                signature_expires_in: signature_expires_in,
                refresh_token_expires_in: refresh_token_expires_in
            }
        }
    }
}
