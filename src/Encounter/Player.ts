import { User } from "discord.js";

export interface StatBlock {
    Name: string;
    TotalInitiativeModifier: number;
    HP: { Value: number };
    AC: { Value: number };
    Player: string
}

export interface Player {
    readonly user: User;
    readonly statBlock: StatBlock;
}
