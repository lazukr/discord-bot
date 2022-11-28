import Config from "config";
import { LoggerConfig } from "@lazukr/common";
import { DiscordConfig } from "./DiscordConfig.js";
import { ServiceConfig } from "./ServiceConfig.js";

export interface BotConfig extends LoggerConfig, DiscordConfig, ServiceConfig {
    logToConsole: boolean;
    logToFile: boolean;
    logToError: boolean;
    token: string;
    prefix: string;
};

export const config: BotConfig = {
    token: Config.get("token"),
    prefix: Config.get("prefix"),
    logToConsole: Config.get("logToConsole"),
    logToFile: Config.get("logToFile"),
    logToError: Config.get("logToError"),
    url: Config.get("serviceUrl"),
};