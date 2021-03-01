export interface EnvModel {
    app_key: string;
    port: number;
    mysql: Mysql,
    origin_urls: OriginUrls
}

interface Mysql {
    database: string;
    username: string;
    password: string;
    host: string;
    port: number;
}

interface OriginUrls {
    cdn: string;
    client: string;
}
