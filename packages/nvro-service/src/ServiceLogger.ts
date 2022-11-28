import { config } from "./configuration/Config.js";
import { WinstonLogger, Logger } from "@lazukr/common";

export class ServiceLogger {
    private static _instance : ServiceLogger = new ServiceLogger();
    private logger: Logger;
    constructor() {
        if (ServiceLogger._instance) {
            throw new Error("Error: Instantiation Failed. Use 'Logger.instance' instead of new.");
        }
        this.logger = new WinstonLogger(config);
        ServiceLogger._instance = this;
    }

    private static get Instance() : ServiceLogger {
        return ServiceLogger._instance;
    }

    public static log(message: string) {
        ServiceLogger.Instance.logger.log(message);
    }

    public static warn(message: string) {
        ServiceLogger.Instance.logger.warn(message);
    }

    public static error(message: string) {
        ServiceLogger.Instance.logger.error(message);
    }
}