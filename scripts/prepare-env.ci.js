const fs = require("fs");
const path = require("path");
const getEnvWithVars = require("./_get-env-with-vars");

const _env = fs.readFileSync(path.resolve(__dirname, "../env.example.json"), {encoding: "utf8"});
const env = JSON.parse(_env);
const newEnv = getEnvWithVars(env);

const configPath = path.resolve(__dirname, "../env.json");
const isConfigExist = fs.existsSync(configPath);

if (isConfigExist) {
    fs.unlinkSync(configPath);
}

fs.writeFileSync(configPath, JSON.stringify(newEnv), {encoding: "utf8"});
