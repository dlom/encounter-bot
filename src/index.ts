import { EncounterBot } from "./EncounterBot";
import { token, owner } from "./config";

const bot = new EncounterBot(token, owner);
bot.start();
