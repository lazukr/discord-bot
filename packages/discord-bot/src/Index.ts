import { DiscordBot } from "./DiscordBot";
import { BotConfig } from "./configuration/BotConfig";
import config from "./config.json";

const bot = new DiscordBot(config as BotConfig);
bot.start();