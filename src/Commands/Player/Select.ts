import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { PlayerManager } from "../../Encounter/PlayerManager";
import { StatBlock } from "../../Encounter/Player";

export default class SelectCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            "name": "select",
            "aliases": ["pick"],
            "group": "player",
            "memberName": "select",
            "description": "Select a character to be associated with a guild",
            "guildOnly": true,
            "args": [
                {
                    "key": "name",
                    "label": "name",
                    "prompt": "what character would you like to select?",
                    "type": "string" // TODO: add custom 'Character' type
                }
            ]
        });
    }

    async run(msg: CommandMessage, args: { "name": string }) {
        // name should theoretically be valid here
        // TODO: remove when types are validated
        const user = msg.author;
        const guild = msg.guild;

        PlayerManager.selectStatBlock(guild, user, args.name);

        return msg.reply(`Selected '${args.name}' for you`);
    }
}
