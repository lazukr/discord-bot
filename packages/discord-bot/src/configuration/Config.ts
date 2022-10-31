import Config from "config";

export interface BotConfig {
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
};