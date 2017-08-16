import { Snowflake, Collection, User, Guild } from "discord.js";
import { Player } from "./Player";
import { Encounter } from "./Encounter";

class EncounterManager {
    private map: Map<Snowflake, Collection<string, Encounter>>;

    constructor() {
        this.map = new Map();
    }

    public async createEncounter(guild: Guild, gm: User, players: Player[]) {
        if (!this.map.has(guild.id)) {
            this.map.set(guild.id, new Collection());
        }
        const c = this.map.get(guild.id);
        const encounter = await new Encounter(guild, gm, players).start();
        c.set(encounter.id, encounter);
        return encounter;
    }

    public removeEncounter(guild: Guild, encounter: Encounter) {
        encounter.stop();
        if (!this.map.has(guild.id)) return;
        const c = this.map.get(guild.id);
        c.delete(encounter.id);
    }

    public getEncountersFor(guild: Guild, users: User[]): Encounter[];
    public getEncountersFor(guild: Guild, users: User, andIsGm: boolean): Encounter[];
    public getEncountersFor(guild: Guild, users: User[] | User, andIsGm?: boolean): Encounter[] {
        if (!this.map.has(guild.id)) return [];
        const c = this.map.get(guild.id);
        return c.filterArray((encounter) => {
            if (Array.isArray(users)) {
                return encounter.hasAnyUser(users);
            } else {
                return encounter.hasUser(users, andIsGm);
            }
        });
    }
}

export default new EncounterManager();
