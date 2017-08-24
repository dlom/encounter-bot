const { token, owner, api, db }: {
    token: string,
    owner: string,
    api: string,
    db: string
} = require("../settings.json");

const imageApi = (api.includes("localhost") ? "http://improved-initiative.com" : api);

export { token, owner, api, imageApi, db };
