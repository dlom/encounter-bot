import { Snowflake, Collection, User, Guild } from "discord.js";
import { CommandoClient } from "discord.js-commando";
import { Database } from "sqlite";

import { Encounter } from "./Encounter";
import { Player, StatBlock } from "./Player";

interface StatBlockRow {
    owner: Snowflake;
    data: Buffer;
    guild: Snowflake;
}

class PlayerManager {
    private db: Database;

    public async init(db: Database): Promise<void> {
        this.db = db;
        await this.db.run(`CREATE TABLE IF NOT EXISTS statblocks (owner TEXT NOT NULL, data BLOB NOT NULL, guild TEXT NOT NULL, UNIQUE (owner, guild))`);
    }

    public async getEncounterStatBlocks(users: User[], guild: Guild): Promise<Player[]> {
        const statement = await this.db.prepare(`SELECT * FROM statblocks WHERE owner IN (${users.map(() => "?").join(", ")}) AND guild = ?`);
        const rows: StatBlockRow[] = await statement.all([...users.map(user => user.id), guild.id]);
        return users.map((user) => {
            const row = rows.find((row) => {
                return row.owner === user.id;
            });
            const data = (row != null) ? row.data : null;
            return PlayerManager.rowToPlayer({ owner: user.id, data, guild: guild.id })
        });
    }

    public async getPlayers(user: User): Promise<Player[]>;
    public async getPlayers(guild: Guild): Promise<Player[]>;
    public async getPlayers(term: User | Guild): Promise<Player[]> {
        const prop = (term instanceof Guild) ? "guild" : "owner";
        const statement = await this.db.prepare(`SELECT * FROM statblocks WHERE ${prop} = ?`);
        const rows: StatBlockRow[] = await statement.all([term.id]);
        return rows.map(row => PlayerManager.rowToPlayer(row));
    }

    public async getPlayer(user: User, guild: Guild): Promise<Player> {
        const statement = await this.db.prepare(`SELECT * FROM statblocks WHERE owner = ? AND guild = ?`);
        const row: StatBlockRow = await statement.get([user.id, guild.id]);
        return PlayerManager.rowToPlayer(row);
    }

    public async registerStatBlock(statBlock: StatBlock | Buffer, user: User, guild: Guild): Promise<Player> {
        const statement = await this.db.prepare(`INSERT OR REPLACE INTO statblocks VALUES (?, ?, ?)`);
        const data = (Buffer.isBuffer(statBlock)) ? statBlock : Buffer.from(JSON.stringify(statBlock), "utf8");
        await statement.run([user.id, data, guild.id]);
        return PlayerManager.rowToPlayer({ owner: user.id, data, guild: guild.id });
    }

    private static parseStatBlock(data: Buffer): StatBlock {
        if (data == null) return null;
        const decoded = data.toString("utf8");
        const statBlock: StatBlock = JSON.parse(decoded);
        if (statBlock.Name == null) {
            throw new Error("Property 'Name' missing on statblock");
        }
        return statBlock;
    }

    private static rowToPlayer(row: StatBlockRow): Player {
        if (row == null) return null;
        const userId = row.owner;
        const statBlock = PlayerManager.parseStatBlock(row.data);
        const guildId = row.guild;
        return { userId, statBlock, guildId } as Player;
    }
}

const singleton = new PlayerManager();

export { singleton as PlayerManager };
