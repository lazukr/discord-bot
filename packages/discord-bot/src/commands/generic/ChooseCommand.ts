import { Logger } from "../../Logger";
import { randomInteger, RandomIntegerGenerator } from "../../utils/randomInteger";
import { RegisterableCommand } from "../RegisterableCommand";

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
        Logger.log(`Command [${COMMAND_NAME}] from ${msg.author} with args: ${args.join("")}`);
        const result = choose(args);
        return `\`${result}\``;
    },
    options: {
        description: "Chooses an option from the list provided.",
        fullDescription: "Chooses an option from the list provided.",
        aliases: ["c"],
    },
};