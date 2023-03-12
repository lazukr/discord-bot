import axios from "axios";
import { BotLogger } from "../../BotLogger.js";
import { RegisterableCommand } from "../RegisterableCommand.js";

const COMMAND_NAME = "dadjoke";
const URL = "https://icanhazdadjoke.com/";

interface DadJokeResponse {
    id: string,
    joke: string,
    status: number,
};

// not sure if i can unit test much of this well
export const DadJokeCommand: RegisterableCommand = {
    name: COMMAND_NAME,
    command: async (msg, args) => {
        BotLogger.log(`Command [${COMMAND_NAME}] from ${msg.author.id}-[${msg.author.username}] with args: ${args.join("")}`);
        try {
            const { data } = await axios.get(URL, {
                headers: {
                    "Accept": "application/json",
                    "Accept-Encoding": "application/json",
                    "User-Agent": "Discord Bot (https://github.com/lazukr/discord-bot)",
                },
            });

            const result = data as DadJokeResponse;
            if (result && result?.status !== 200) {
                BotLogger.warn(`Could not get dad joke.${result?.status}`);
                return "Could not get dad joke.";
            }
            
            BotLogger.log(`Result from command [${COMMAND_NAME}]: ${result.joke}`);
            return result!.joke;
        }
        catch (ex) {
            BotLogger.error(ex);
            return "Could not get dad joke.";
        }
    },
    options: {
        description: "Gets a random dad joke.",
        fullDescription: "Gets a random dad joke.",
        aliases: ["dj"],
    },
};