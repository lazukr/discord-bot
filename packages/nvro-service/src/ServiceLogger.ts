import { config } from "./configuration/Config.js";
import { WinstonLogger, Logger } from "@lazukr/common";

export class BotLogger {
    private static _instance : BotLogger = new BotLogger();
    private logger: Logger;
    constructor() {
        if (BotLogger._instance) {
            throw new Error("Error: Instantiation Failed. Use 'Logger.instance' instead of new.");
        }
        this.logger = new WinstonLogger(config);
        BotLogger._instance = this;
    }

    private static get Instance() : BotLogger {
        return BotLogger._instance;
    }

    public static log(message: string) {
        BotLogger.Instance.logger.log(message);
    }

    public static warn(message: string) {
        BotLogger.Instance.logger.warn(message);
    }

    public static error(message: string) {
        BotLogger.Instance.logger.error(message);
    }
}