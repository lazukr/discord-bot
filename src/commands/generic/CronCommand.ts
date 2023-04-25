import Cronstrue from "cronstrue";
import { BotLogger } from "../../BotLogger.js";
import { RegisterableCommand } from "../RegisterableCommand.js";

const COMMAND_NAME = "croncheck";


// not sure if i can unit test much of this well
export const CronCheckCommand: RegisterableCommand = {
    name: COMMAND_NAME,
    command: async (msg, args) => {
        BotLogger.log(`Command [${COMMAND_NAME}] from ${msg.author.id}-[${msg.author.username}] with args: ${args.join("")}`);
        const arg = args.join(" ").replace(/`/g, "");

        try {
            const cronResult = Cronstrue.toString(arg, {verbose: true});
            return cronResult;
        } catch (ex) {
            BotLogger.warn(ex);
            return ex;
        }
    },
    options: {
        usage: "`<cron format>`, e.g. `0 5 * * *`",
        description: "Converts cron format into a readable format.",
        fullDescription: "Converts cron format into a readable format.",
        aliases: ["cc"],
        argsRequired: true,
    },
};