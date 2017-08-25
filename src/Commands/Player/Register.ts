import { Command, CommandMessage, CommandoClient } from "discord.js-commando";

import { PlayerManager } from "../../Encounter/PlayerManager";
import { StatBlock } from "../../Encounter/Player";
import * as Util from "../Util";

export default class RegisterCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            "name": "register",
            "aliases": ["update"],
            "group": "player",
            "memberName": "register",
            "description": "Register a character for use in encounters",
            "guildOnly": true,
            "args": [
                {
                    "key": "data",
                    "label": "data",
                    "prompt": "Paste and respond with your data to be imported:",
                    "type": "string"
                }
            ]
        });
    }

    async run(msg: CommandMessage, args: { "data": string }) {
        // TODO: check if statblock with this name already exists
        const user = msg.author;
        const guild = msg.guild;

        const player = await PlayerManager.getPlayer(user, guild);
        if (player != null) {
            const overwriteMessage = `Statblock ${player.statBlock.Name} already exists.  Overwrite?`;
            if (!await Util.confirm(msg, overwriteMessage)) {
                return msg.reply(`Cancelled.`);
            }
        }

        const data = Buffer.from(args.data, "base64");
        const newPlayer = await PlayerManager.registerStatBlock(data, user, guild);
        return msg.reply(`Registered statblock '${newPlayer.statBlock.Name}' for '${guild.name}'`);
    }
}
