import { Command } from "eris";
import { Logger } from "../../Logger";
import { DiscordBot } from "../../DiscordBot";
import { randomInteger } from "../../utils/randomInteger";

export class ChooseCommand extends Command {
    constructor(client: DiscordBot) {
        super("choose", (msg, args) => {
            Logger.log(`Choose command from ${msg.author} with args: ${args}`);
            const list = args
                .join("")
                .split(",")
                .map(x => x.trim());

            const rand = randomInteger(0, args.length);
            msg.channel.createMessage(`\`${list[rand]}\``);
        }, {
            description: "Chooses an option from the list provided.",
            fullDescription: "Chooses an option from the list provided.",
            aliases: ["c"],
        });
    }
}