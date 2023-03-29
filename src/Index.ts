import { DiscordBot } from "./DiscordBot.js";
import { config } from "./configuration/Config.js";
import { Scheduler } from "./Scheduler.js";
const bot = new DiscordBot(config);
Scheduler.init(bot);
bot.start();