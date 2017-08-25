import { EncounterBot } from "./EncounterBot";
import { token, owner, db } from "./config";

const bot = new EncounterBot(token, owner, db);
bot.start();
