import * as request from "request";
import { User, Snowflake, Collection, Guild, RichEmbed } from "discord.js";
import * as io from "socket.io-client";
import * as qs from "qs";
import { Player, StatBlock } from "./Player"
import { api, imageApi } from "../util"



export class Encounter {
    private socket: SocketIOClient.Socket;
    private encounterId: string;
    private players: Collection<Snowflake, Player>;

    constructor(private guild: Guild, private gm: User, players: Player[]) {
        this.players = new Collection();
        players.forEach((player) => {
            this.players.set(player.user.id, player);
        });
        this.socket = io.connect(api);
    }

    public start(): Promise<void> {
        if (this.encounterId != null) {
            return Promise.resolve();
        }

        const target = `${api}/createencounter/`;

        const promise = new Promise<void>((resolve, reject) => {
            request.post(target, {
                "json": true
            }, (error, response, body) => {
                if (error) return reject(error);
                if (response.statusCode !== 200) return reject("Unknown response from Improved Initiative");
                this.encounterId = body.encounterId;
                resolve();
            });
        });
        return promise;
    }

    public stop() {
        this.socket.disconnect();
    }

    public hasUser(user: User, andIsGm: boolean): boolean {
        if (this.gm.id === user.id) return true;
        if (andIsGm) return false;
        return this.players.has(user.id);
    }

    public hasAnyUser(users: User[]): boolean {
        return users.some((user) => {
            return this.hasUser(user, false);
        });
    }

    public getLink(playerLink: boolean): string {
        if (this.encounterId == null) {
            return `${api}`;
        } else {
            return `${api}/${playerLink ? "p" : "e"}/${this.encounterId}`;
        }
    }

    public removePlayer(user: User) {
        this.players.delete(user.id);
    }

    private generatePayload(): { Combatants: StatBlock[] } {
        const combatants = this.players.map((player) => {
            return player.statBlock;
        });

        return { "Combatants": combatants };
    }

    public getPayloadLink(): string {
        const payload = qs.stringify(this.generatePayload());
        if (this.encounterId == null) {
            return `${api}/importencounter/?${payload}`;
        } else {
            return `${api}/importencounter/${this.encounterId}?${payload}`;
        }
    }

    public getPlayerEmbed(): RichEmbed {
        return new RichEmbed()
            .setTitle("Encounter ready")
            .setDescription(`Click [here](${this.getLink(true)}) to join!`)
            .setColor(0x00643C)
            .setFooter(`Powered by Improved Initiative`, `${imageApi}/img/boot-transparent-white.png`);
    }

    public getGmEmbed(): RichEmbed {
        return new RichEmbed()
            .addField("Create encounter", `Click [here](${this.getPayloadLink()}) to create the encounter. Only click this once!`)
            .addField("Rejoin encounter", `Click [here](${this.getLink(false)  }) to rejoin the encounter if you close the tab.`)
            .setColor(0x00643C)
            .setFooter(`Powered by Improved Initiative`, `${imageApi}/img/boot-transparent-white.png`);
        }

    public get id() {
        return this.encounterId;
    }
}
