import { Message, RichEmbed } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";

import { AnyDice } from "anydice";

export default class EndCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            "name": "roll",
            "group": "roll",
            "memberName": "roll",
            "description": "Roll a die",
            "guildOnly": false,
            "args": [
                {
                    "key": "expression",
                    "prompt": "What die expression to roll?\n",
                    "type": "string"
                }
            ]
        });
    }

    async run(msg: CommandMessage, args: { "expression": string }) {
        const expression = `output ${args.expression}`;
        const decimalPlaces = 2;
        const placeholder = await msg.reply("Rolling... (this can take a second)") as Message;
        try {
            const results = await AnyDice.run(expression, false);
            const name = results.default();
            const roll = results.roll(name, 1)[0];
            const distribution = results.get(name);

            const chance = distribution.find(x => x[0] === roll)[1].toFixed(decimalPlaces);
            const higher = distribution.filter(x => x[0] > roll)
                .map(x => x[1])
                .reduce((sum, x) => sum + x, 0).toFixed(decimalPlaces);
            const lower = distribution.filter(x => x[0] < roll)
                .map(x => x[1])
                .reduce((sum, x) => sum + x, 0).toFixed(decimalPlaces);
            const embed = new RichEmbed()
                .setTitle("Result")
                .setDescription(`${roll}`)
                .addField("Chance", `${chance}%`)
                .addField("Chance to roll higher", `${higher}%`)
                .addField("Chance to roll lower", `${lower}%`)
                .addField("Analyze", `[Click here to analyze](${results.analyze()})`);
            return placeholder.edit({ "embed": embed });
        } catch (e) {
            return placeholder.edit(`AnyDice error: ${e.toString()}`);
        }
    }
}
