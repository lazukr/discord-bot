import Config from "config";
import { LoggerConfig } from "../logging/LoggerConfig.js";
import { DiscordConfig } from "./DiscordConfig.js";
export interface BotConfig extends LoggerConfig, DiscordConfig {
    logToConsole: boolean;
    logToFile: boolean;
    logToError: boolean;
    token: string;
    prefix: string;
    agenda: string;
    usertz: {[key: string]: string}
};

export const config: BotConfig = {
    token: Config.get("token"),
    prefix: Config.get("prefix"),
    logToConsole: Config.get("logToConsole"),
    logToFile: Config.get("logToFile"),
    logToError: Config.get("logToError"),
    agenda: Config.get("agenda"),
    usertz: Config.get("usertz"),
};