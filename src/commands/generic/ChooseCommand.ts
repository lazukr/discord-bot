import { BotLogger } from "../../BotLogger.js";
import { randomInteger, RandomIntegerGenerator } from "../../utils/randomInteger.js";
import { RegisterableCommand } from "../RegisterableCommand.js";

const COMMAND_NAME = "choose";

export const choose = (
    args: string[], 
    randomNumGenerator: RandomIntegerGenerator = randomInteger) => {
        
    if (args.length === 0) {
        return "No items to choose from.";
    }

    const list = args
        .join("")
        .split(",")
        .map(x => x.trim());

    const rand = randomNumGenerator(0, args.length);
    return list[rand];
};

export const ChooseCommand: RegisterableCommand = {
    name: COMMAND_NAME,
    command: (msg, args) => {
        BotLogger.log(`Command [${COMMAND_NAME}] from ${msg.author.id}-[${msg.author.username}] with args: ${args.join("")}`);
        const result = choose(args);
        BotLogger.log(`Result from command [${COMMAND_NAME}]: ${result}`);
        return `\`${result}\``;
    },
    options: {
        description: "Chooses an option from the list provided.",
        fullDescription: "Chooses an option from the list provided.",
        aliases: ["c"],
    },
};