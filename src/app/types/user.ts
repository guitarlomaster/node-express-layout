export interface IUserModel {
    id: number;
    email: string;
    password: string;
    role: Role;
    signature?: string;
    signature_expires_in?: number;
    refresh_token?: string;
    refresh_token_expires_in?: number;
}

export interface IAccount {
    email: string;
    name: string;
    role: Role;
    surname?: string;
    birth_date?: string;
    photo?: string;
    photo_miniature?: string;
    about?: string;
    email_confirmed?: boolean;
}

export type Role = "user" | "support" | "admin"
