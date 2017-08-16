import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import PlayerManager from "../../Encounter/PlayerManager";
import { StatBlock } from "../../Encounter/Player";

export default class RegisterCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            "name": "register",
            "group": "player",
            "memberName": "register",
            "description": "Register a character for use in encounters",
            "guildOnly": false,
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
        // TODO: register statblock to guild if ran inside guild
        // TODO: check if statblock with this name already exists
        const user = msg.author;
        const genericErrorMessage = "There was an error parsing your data";

        const decoded = Buffer.from(args.data, "base64").toString("utf8");
        try {
            const statBlock: StatBlock = JSON.parse(decoded);
            if (statBlock.Name == null) {
                return msg.reply(`${genericErrorMessage}: Property 'Name' missing`);
            }
            PlayerManager.registerStatBlock(user, statBlock);
            return msg.reply(`Registered statblock '${statBlock.Name}'.  Remember to select this statblock in your guild!`);
        } catch(error) {
            return msg.reply(`${genericErrorMessage}: ${error.toString()}`)
        }
    }
}
