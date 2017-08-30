import { Snowflake, Collection, User, Guild } from "discord.js";

import { Player } from "./Player";
import { Encounter } from "./Encounter";

// TODO: implement persistant storage

class EncounterManager {
    // [guild: [encounter]]
    private collection: Collection<Snowflake, Collection<string, Encounter>>;

    constructor() {
        this.collection = new Collection();
    }

    public async startEncounter(guild: Guild, gm: User, players: Player[]): Promise<Encounter> {
        if (!this.collection.has(guild.id)) {
            this.collection.set(guild.id, new Collection());
        }
        const c = this.collection.get(guild.id);
        const encounter = new Encounter(guild, gm, players);
        await encounter.start();
        c.set(encounter.id, encounter);
        return encounter;
    }

    public endEncounter(guild: Guild, encounter: Encounter) {
        encounter.stop();
        if (!this.collection.has(guild.id)) return;
        const c = this.collection.get(guild.id);
        c.delete(encounter.id);
    }

    public getEncountersFor(guild: Guild, users: User[]): Encounter[];
    public getEncountersFor(guild: Guild, users: User, andIsGm: boolean): Encounter[];
    public getEncountersFor(guild: Guild, users: User[] | User, andIsGm?: boolean): Encounter[] {
        if (!this.collection.has(guild.id)) return [];
        const c = this.collection.get(guild.id);
        return c.filterArray((encounter) => {
            if (Array.isArray(users)) {
                return encounter.hasAnyUser(users);
            } else {
                return encounter.hasUser(users, andIsGm);
            }
        });
    }
}

const singleton = new EncounterManager();

export { singleton as EncounterManager };
