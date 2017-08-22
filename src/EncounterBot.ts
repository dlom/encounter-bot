import { CommandoClient, FriendlyError } from "discord.js-commando";
import { Snowflake } from "discord.js";
import * as path from "path"

export class EncounterBot {
    private client: CommandoClient;

    constructor(private token: string, owner: string) {
        this.client = new CommandoClient({ owner });
        this.client
            .on("error", console.error)
            .on("warn", console.warn)
            .on("debug", console.log)
            .on("ready", () => {
                console.log(`Logged in as ${this.client.user.username}#${this.client.user.discriminator} (${this.client.user.id})`);
            })
            .on("disconnect", () => { console.warn("Disconnected!"); })
            .on("reconnect", () => { console.warn("Reconnecting..."); })
            .on("commandError", (cmd, err) => {
                if (err instanceof FriendlyError) return;
                console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
            });

        this.client.registry
            .registerDefaults()
            .registerGroups([
                ["encounter", "Encounter"],
                ["player", "Player"]
            ])
            .registerCommandsIn(path.join(__dirname, "Commands"));
    }

    public async start() {
        console.log("Starting EncounterBot...");
        return this.client.login(this.token);
    }
}
