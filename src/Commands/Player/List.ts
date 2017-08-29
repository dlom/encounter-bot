import { RichEmbed } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";

import { PlayerManager } from "../../Encounter/PlayerManager";

export default class ListCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            "name": "list",
            "group": "player",
            "memberName": "list",
            "description": "List all characters registered with this bot",
            "guildOnly": false
        });
    }

    async run(msg: CommandMessage) {
        const user = msg.author;

        const players = await PlayerManager.getPlayers(user);
        const embed = new RichEmbed().setColor(0x00643C);
        players.forEach((player) => {
            const guild = this.client.guilds.get(player.guildId);
            const guildName = (guild != null) ? guild.name : "Unknown";
            embed.addField(player.statBlock.Name, `Guild: ${guildName}`);
        });
        return msg.reply({ embed });
    }
}
