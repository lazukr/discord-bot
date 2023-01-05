import axios, { AxiosError } from "axios";
import { config } from "../../configuration/Config.js";
import { BotLogger } from "../../BotLogger.js";
import { RegisterableCommand } from "../RegisterableCommand.js";
import { parseMarketArgs } from "./utils/marketParser.js";
import { ItemResultList } from "./utils/itemResult.js";
import { marketPrettyPrinter } from "./utils/marketPrettyPrinter.js";

const COMMAND_NAME = "novamarket";

export const NovaMarketCommand: RegisterableCommand = {
    name: COMMAND_NAME,
    command: async (msg, args) => {
        const processedArgs = args.join("").split(",").map(arg => arg.trim());
        BotLogger.log(`Command [${COMMAND_NAME}] ran from ${msg.author} with args: ${processedArgs}`);
        const request = parseMarketArgs(processedArgs);

        if (isNaN(request.itemId)) {
            msg.channel.createMessage("itemId is not valid.");
            return;
        }

        try {
            const {data, status} = await axios.post("/getItemMarketById", request);
            const result = data as ItemResultList;

            BotLogger.log(`Result from getItemMarketById for ${request.itemId} yielded ${result.length} result(s) with status ${status}.`);
            const message = marketPrettyPrinter(result);

            msg.channel.createMessage(`${msg.author.mention}\n${message[0]}`);
            for (let i = 1; i < message.length; i++) {
                msg.channel.createMessage(message[i]);
            }
        } catch (ex) {
            if (ex instanceof(AxiosError)) {
                const exception = ex as AxiosError;
                BotLogger.error(exception.message);
            }
            else {
                BotLogger.error(ex);
            }
        }
    },
    options: {
        description: "Gets market data of an item from NovaRO.",
        fullDescription: "Gets market data of an item from NovaRO.",
        aliases: ["ws"],
        usage: "\`!ws <itemId>, <price>, <refine>, <properties,...>\`",
        argsRequired: true,
        invalidUsageMessage: "`Requires at least one argument.`",
    }
};