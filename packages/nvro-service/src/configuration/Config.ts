import Config from "config";
import { LoggerConfig } from "@lazukr/common";

export interface Config extends LoggerConfig {
    logToConsole: boolean;
    logToFile: boolean;
    logToError: boolean;
};

export const config: Config = {
    logToConsole: Config.get("logToConsole"),
    logToFile: Config.get("logToFile"),
    logToError: Config.get("logToError")
};