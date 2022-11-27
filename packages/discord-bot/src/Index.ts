import { DiscordBot } from "./DiscordBot.js";
import { config } from "./configuration/Config.js";
import axios from "axios";

axios.defaults.baseURL = config.url;
const bot = new DiscordBot(config);
bot.start();