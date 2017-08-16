import { EncounterBot } from "./EncounterBot";
const { token, owner }: { token: string, owner: string } = require("../settings.json");

const bot = new EncounterBot(token, owner);
bot.start();


