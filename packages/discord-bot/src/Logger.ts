import Winston, { format } from "winston";
import Config from "./config.json";
import DailyRotate from "winston-daily-rotate-file";
import { Environment } from "./configuration/Environment";

export class Logger {
    private static _instance : Logger = new Logger();
    private logger: Winston.Logger = Winston.createLogger({
        level: "info",
        format: Winston.format.json(),
        transports: [
            new Winston.transports.File({
                filename: "errors.log",
                level: "error",
                dirname: "./logs/",
            }),
            new DailyRotate({
                level: "info",
                filename: "%DATE%.log",
                datePattern: "YYYY-MM-DD",
                maxFiles: "14d",
                dirname: "./logs/",
            }),
        ],
    });

    constructor() {
        if (Logger._instance) {
            throw new Error("Error: Instantiation Failed. Use 'Logger.instance' instead of new.");
        }
        Logger._instance = this;
        const env = Config as Environment;

        if (env.env !== "prod") {
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