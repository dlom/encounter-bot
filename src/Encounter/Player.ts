import { User, Snowflake } from "discord.js";

export interface StatBlock {
    Name: string;
    TotalInitiativeModifier: number;
    HP: { Value: number };
    AC: { Value: number };
    Player: string
}

export interface Player {
    readonly userId: Snowflake;
    readonly statBlock: StatBlock;
    readonly guildId: Snowflake;
}
