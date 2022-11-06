import { DiscordBot } from "./DiscordBot";
import { config } from "./configuration/Config";
import { serviceConfig } from "./configuration/ServiceConfig";
import axios from "axios";

axios.defaults.baseURL = serviceConfig.url;
const bot = new DiscordBot(config);
bot.start();