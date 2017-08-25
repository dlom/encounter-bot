import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { GuildMember, RichEmbed } from "discord.js"
import { EncounterManager  }from "../../Encounter/EncounterManager";
import { PlayerManager } from "../../Encounter/PlayerManager";
import { Encounter } from "../../Encounter/Encounter";

export default class StartCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            "name": "start",
            "aliases": ["create"],
            "group": "encounter",
            "memberName": "start",
            "description": "Start an encounter",
            "guildOnly": true,
            "args": [
                {
                    "key": "members",
                    "label": "users",
                    "prompt": "who will be part of your encounter? (one per line)\n",
                    "type": "member",
                    "infinite": true
                }
            ]
        });
    }

    async run(msg: CommandMessage, args: { "members": GuildMember[] }) {
        const guild = msg.guild;
        const gm = msg.author;
        const users = args.members.map((member) => {
            return member.user;
        });

        const existingEncounters = await EncounterManager.getEncountersFor(guild, users.concat(gm));
        if (existingEncounters.length > 0) {
            // TODO: get info on what players/which encounters
            return msg.reply(`Some players are already in an encounter! Try again`);
        }

        const players = await PlayerManager.getEncounterStatBlocks(users, guild);
        const invalidPlayers = players.filter((player) => {
            return (player.statBlock == null);
        });
        if (invalidPlayers.length > 0) {
            const invalidMentions = invalidPlayers.map(player => `<@${player.userId}>`).join(", ");
            return msg.say(`The following players are missing statblocks: ${invalidMentions}`);
        }

        const encounter = await EncounterManager.createEncounter(guild, gm, players);

        const gmEmbed = encounter.getGmEmbed();
        const playerEmbed = encounter.getPlayerEmbed();

        await msg.author.send({ "embed": gmEmbed });
        return msg.channel.send({ "embed": playerEmbed });
    }
}
