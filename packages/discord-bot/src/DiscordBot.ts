import Eris from "eris";
import { Logger } from "./Logger";
import { BotConfig } from "./configuration/BotConfig";
import { CommandList } from "./commands/CommandList";

export class DiscordBot extends Eris.CommandClient {    
    constructor(config: BotConfig) {
        if (!config) {
            throw new TypeError("config cannot be empty or null.");
        }

        if (!config.token) {
            throw new TypeError("config.token cannot be empty or null.");
        }

        const token = config.token;
        const prefix = config.prefix ?? "!";
        super(token, {
            intents: [
                Eris.Constants.Intents.guilds,
                Eris.Constants.Intents.guildMessages,
            ],
        }, {
            prefix: prefix,
            ignoreBots: true,
            ignoreSelf: true,
        });
    }

    attachListeners() {
        this.on("ready", () => {
            Logger.log("ready!");
        });

        this.on("connect", () => {
            Logger.log("connected!");
        });

        this.on("disconnect", () => {
            Logger.warn("disconnected!");
        });

        this.on("error", (error) => {
            Logger.error(error.message);
        });
    }

    loadCommands() {
        Logger.log(`Registering ${CommandList.length} command(s)...`);
        for (const Command of CommandList) {
            const cmd = new Command(this);
            Logger.log(`Registering "${cmd.label}" command...`);
            const registeredCommand = this.registerCommand(cmd.label, (msg, args) => {
                cmd.executeCommand(msg, args);
            }, {
                description: cmd.description,
                aliases: cmd.aliases,
            });
            Logger.log(`Registered "${cmd.label}" successfully!`);
        }
    }

    start() {
        this.loadCommands();
        this.attachListeners();
        this.connect();
    }
}

