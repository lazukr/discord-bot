import { Command } from "eris";
import { Logger } from "../../Logger";
import { DiscordBot } from "../../DiscordBot";
import { randomInteger, RandomIntegerGenerator } from "../../utils/randomInteger";

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

export class ChooseCommand extends Command {
    constructor(client: DiscordBot) {
        super("choose", (msg, args) => {
            Logger.log(`Choose command from ${msg.author} with args: ${args.join("")}`);
            const result = choose(args);
            msg.channel.createMessage(`\`${result}\``);
        }, {
            description: "Chooses an option from the list provided.",
            fullDescription: "Chooses an option from the list provided.",
            aliases: ["c"],
        });
    }
}