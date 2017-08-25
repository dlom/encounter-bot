import { Snowflake } from "discord.js";
import { CommandoClient, FriendlyError, SQLiteProvider } from "discord.js-commando";
import * as sqlite from "sqlite";
import * as path from "path"

import { EncounterManager } from "./Encounter/EncounterManager";
import { PlayerManager } from "./Encounter/PlayerManager";

export class EncounterBot {
    private client: CommandoClient;

    constructor(private token: string, owner: string, private db: string) {
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
        const database = await sqlite.open(this.db);
        const token = await this.client.login(this.token);
        await this.client.setProvider(new SQLiteProvider(database));
        await PlayerManager.init(database);
        // TODO: await EncounterManager.init(database);
        return token;
    }
}
