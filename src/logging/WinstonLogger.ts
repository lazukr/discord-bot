import Winston, { format } from "winston";
import DailyRotate from "winston-daily-rotate-file";
import { Logger } from "./Logger.js";
import { LoggerConfig } from "./LoggerConfig.js";

const { combine, json, timestamp } = format;
export class WinstonLogger implements Logger {
    private logger: Winston.Logger;
    constructor(config: LoggerConfig) {
        this.logger = Winston.createLogger({
            level: "info",
            format: Winston.format.json(),
            transports: [],
        });

        if (config.logToError) {
            this.logger.add(new Winston.transports.File({
                format: combine(
                    timestamp({
                        format: "YYYY-MM-DD HH:mm:ss.SSS",
                      }),
                    json(),
                ),
                filename: "errors.log",
                level: "error",
                dirname: "./logs/",
            }));
        }

        if (config.logToFile) {
            this.logger.add(new DailyRotate({
                format: combine(
                    timestamp({
                        format: "YYYY-MM-DD HH:mm:ss.SSS",
                      }),
                    json(),
                ),
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
    }

    public log(message: string) {
        this.logger.info(message);
    }

    public warn(message: string) {
        this.logger.warn(message);
    }

    public error(message: string) {
        this.logger.error(message);
    }
}