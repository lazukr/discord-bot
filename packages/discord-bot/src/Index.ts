import { DiscordBot } from "./DiscordBot";
import { config } from "./configuration/Config";
const bot = new DiscordBot(config);
bot.start();