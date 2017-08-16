import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import EncounterManager from "../../Encounter/EncounterManager";
import { Encounter } from "../../Encounter/Encounter";

export default class EndCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            "name": "end",
            "aliases": ["stop"],
            "group": "encounter",
            "memberName": "end",
            "description": "End an encounter",
            "guildOnly": true,
            "args": [
                {
                    "key": "force",
                    "label": "confirm",
                    "prompt": "are you sure you want to end the encounter?\n",
                    "type": "boolean"
                }
            ]
        });
    }

    async run(msg: CommandMessage, args: { "force": boolean }) {
        const guild = msg.guild;
        const gm = msg.author;

        const existingEncounters = await EncounterManager.getEncountersFor(guild, gm, true);
        if (existingEncounters.length < 1) {
            return msg.reply(`You aren't currently leading an encounter! Sorry xD`);
        }
        EncounterManager.removeEncounter(guild, existingEncounters[0]);
        return msg.reply(`The encounter was destroyed.  Have a great day.`);
    }
}
