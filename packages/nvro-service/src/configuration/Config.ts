import Config from "config";
import { LoggerConfig } from "@lazukr/common";
import { CacheConfig } from "../cache/CacheConfig.js";

export const loggerConfig: LoggerConfig = {
    logToConsole: Config.get("logToConsole"),
    logToFile: Config.get("logToFile"),
    logToError: Config.get("logToError"),
};

export const cacheConfig: CacheConfig = {
    cacheDuration: Config.get("cacheDuration")
};