function getEnvWithVariables(defaultEnv) {
    if (defaultEnv && defaultEnv.mysql && defaultEnv.origin_urls) {
        return {
            ...defaultEnv,
            mysql: {
                database: process.env.MYSQL_DATABASE || defaultEnv.mysql.database,
                username: process.env.MYSQL_USER || defaultEnv.mysql.username,
                password: process.env.MYSQL_PASSWORD || defaultEnv.mysql.password,
                host: process.env.MYSQL_HOST || defaultEnv.mysql.host,
                port: parseInt(process.env.MYSQL_PORT) || defaultEnv.mysql.port
            },
            origin_urls: {
                cdn: process.env.CDN_PORT ? `http://localhost:${process.env.CDN_PORT}` : defaultEnv.origin_urls.cdn,
                client: process.env.CLIENT_PORT ? `http://localhost:${process.env.CLIENT_PORT}` : defaultEnv.origin_urls.client
            }
        };
    } else {
        throw 'Incorrect env is passed to "_get-env-with-vars.js" function';
    }
}
module.exports = getEnvWithVariables;
