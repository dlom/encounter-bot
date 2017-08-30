import { Command, CommandMessage, CommandoClient } from "discord.js-commando";

import { EncounterManager } from "../../Encounter/EncounterManager";
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
                    "key": "confirm",
                    "prompt": "Are you sure you want to end the encounter?\n",
                    "type": "boolean"
                }
            ]
        });
    }

    async run(msg: CommandMessage, args: { "confirm": boolean }) {
        const guild = msg.guild;
        const gm = msg.author;

        if (!args.confirm) {
            return msg.reply(`Encounter not cancelled.  xD`);
        }

        const existingEncounters = await EncounterManager.getEncountersFor(guild, gm, true);
        if (existingEncounters.length < 1) {
            return msg.reply(`You aren't currently leading an encounter! Sorry xD`);
        }
        EncounterManager.endEncounter(guild, existingEncounters[0]);
        return msg.reply(`The encounter was destroyed.  Have a great day.`);
    }
}
