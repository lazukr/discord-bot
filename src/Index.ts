import { DiscordBot } from "./DiscordBot.js";
import { config } from "./configuration/Config.js";

const bot = new DiscordBot(config);
bot.start();