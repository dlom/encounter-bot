const { api }: { api: string } = require("../settings.json");
const imageApi = (api.includes("localhost") ? "http://improved-initiative.com" : api);

export { api, imageApi };
