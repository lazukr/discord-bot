import Winston, { format } from "winston";
import DailyRotate from "winston-daily-rotate-file";
import { config } from "./configuration/Config";

export class Logger {
    private static _instance : Logger = new Logger();
    private logger: Winston.Logger;
    constructor() {
        if (Logger._instance) {
            throw new Error("Error: Instantiation Failed. Use 'Logger.instance' instead of new.");
        }

        this.logger = Winston.createLogger({
            level: "info",
            format: Winston.format.json(),
            transports: [],
        });

        if (config.logToError) {
            this.logger.add(new Winston.transports.File({
                filename: "errors.log",
                level: "error",
                dirname: "./logs/",
            }));
        }

        if (config.logToFile) {
            this.logger.add(new DailyRotate({
                level: "info",
                filename: "%DATE%.log",
                datePattern: "YYYY-MM-DD",
                maxFiles: "14d",
                dirname: "./logs/",
            }));
        }
        
        if (config.logToConsole) {
            this.logger.add(new Winston.transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.timestamp({
                        format: "YYYY-MM-DD HH:mm:ss.SSS",
                    }),
                    format.align(),
                    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
                ),
            }));
        }
 
        Logger._instance = this;
    }

    private static get Instance() : Logger {
        return Logger._instance;
    }

    public static log(message: string) {
        Logger.Instance.logger.info(message);
    }

    public static warn(message: string) {
        Logger.Instance.logger.warn(message);
    }

    public static error(message: string) {
        Logger.Instance.logger.error(message);
    }
}