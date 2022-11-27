import { CommandClient, Constants } from "eris";
import { BotLogger } from "./BotLogger.js";
import { BotConfig } from "./configuration/Config.js";
import { CommandList } from "./commands/CommandList.js";

export class DiscordBot extends CommandClient {    
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
                Constants.Intents.guilds,
                Constants.Intents.guildMessages,
            ],
        }, {
            prefix: prefix,
            ignoreBots: true,
            ignoreSelf: true,
        });
    }

    attachListeners() {
        this.on("ready", () => {
            BotLogger.log("ready!");
        });

        this.on("connect", () => {
            BotLogger.log("connected!");
        });

        this.on("disconnect", () => {
            BotLogger.warn("disconnected!");
        });

        this.on("error", (error) => {
            BotLogger.error(error.message);
        });
    }

    loadCommands() {
        BotLogger.log(`Registering ${CommandList.length} command(s)...`);
        for (const command of CommandList) {
            BotLogger.log(`Registering "${command.name}" command...`);
            const registeredCommand = this.registerCommand(command.name, command.command, command.options);
            BotLogger.log(`Registered "${command.name}" successfully!`);
        }
    }

    start() {
        this.loadCommands();
        this.attachListeners();
        this.connect();
    }
}

