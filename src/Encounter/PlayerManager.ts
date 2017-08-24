import { Snowflake, Collection, User, Guild } from "discord.js";

import { Encounter } from "./Encounter";
import { Player, StatBlock } from "./Player";

interface FatStatBlock {
    owner: User;
    statBlock: StatBlock;
    selectedGuild: Guild;
}

class PlayerManager {
    // [user: [fsb]]
    private collection: Collection<Snowflake, Collection<string, FatStatBlock>>;

    constructor() {
        this.collection = new Collection();
    }

    public getEncounterStatBlocks(guild: Guild, users: User[]): Player[] {
        return users.map((user) => {
            const statBlock = this.getIndividualStatBlock(guild, user);
            return { user, statBlock } as Player;
        });
    }

    public getAllStatBlocks(user: User): FatStatBlock[] {
        if (!this.collection.has(user.id)) return [];
        return Array.from(this.collection.get(user.id).values());
    }

    private getIndividualStatBlock(guild: Guild, user: User): StatBlock {
        if (!this.collection.has(user.id)) return null;
        const fatStatBlocks = this.collection.get(user.id);
        const fatStatBlock = fatStatBlocks.find((fatStatBlock) => {
            return (fatStatBlock.selectedGuild.id === guild.id);
        });
        if (fatStatBlock) {
            return fatStatBlock.statBlock;
        } else {
            return null;
        }
    }

    public registerStatBlock(owner: User, statBlock: StatBlock) {
        if (!this.collection.has(owner.id)) {
            this.collection.set(owner.id, new Collection());
        }
        const selectedGuild = null;
        const fatStatBlocks = this.collection.get(owner.id);
        fatStatBlocks.set(statBlock.Name, { owner, statBlock, selectedGuild });
    }

    public selectStatBlock(guild: Guild, user: User, name: string) {
        const fatStatBlock = this.getAllStatBlocks(user).find((fatStatBlock) => {
            return fatStatBlock.statBlock.Name === name;
        });
        if (fatStatBlock == null) return;
        fatStatBlock.selectedGuild = guild;
    }
}

const singleton = new PlayerManager();

export { singleton as PlayerManager };
