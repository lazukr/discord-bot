import { DiscordBot } from "./DiscordBot.js";
import { config } from "./configuration/Config.js";
import { Scheduler } from "./Scheduler.js";
import { BotLogger } from "./BotLogger.js";
const bot = new DiscordBot(config);
Scheduler.init(bot);
bot.start();

process.on("uncaughtException", (err, origin) => {
    BotLogger.error(err.message + origin);
});

process.on("unhandledRejection", (reason, promise) => {
    const error = reason as Error;
    const prom = promise.toString();
    BotLogger.error(error.message + prom);
});