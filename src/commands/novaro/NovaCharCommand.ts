import axios, { AxiosError } from "axios";
import { BotLogger } from "../../BotLogger.js";
import { getCharGenLink } from "./utils/charGen.js";
import { RegisterableCommand } from "../RegisterableCommand.js";
import { CharGenRequest } from "./utils/charGenRequest.js";
import { CharGenOption } from "./utils/charGenOption.js";
import { parseCharGenConfig, parseCharGenArgs, CHAR_ACTION_MAX, CHAR_ROTATION_MAX } from "./utils/parser.js";

const COMMAND_NAME = "novachar";

export const NovaCharCommand: RegisterableCommand = {
    name: COMMAND_NAME,
    command: async (msg, args) => {
        BotLogger.log(`Command [${COMMAND_NAME}] ran from ${msg.author.id}-[${msg.author.username}] with args: ${args}`);
        const [name, config] = parseCharGenArgs(args);

        if (name === null) {
            msg.channel.createMessage("Name is invalid.");
            return;
        }

        const [action, rotation] = parseCharGenConfig(config, CHAR_ACTION_MAX, CHAR_ROTATION_MAX);
        BotLogger.log(`${COMMAND_NAME} name: ${name}, bg: ${action}, pose: ${rotation}`);

        const charGenRequest: CharGenRequest = {
            name: name,
            first: action,
            second: rotation,
            mode: CharGenOption.Char
        };

        const link = getCharGenLink(charGenRequest);
        BotLogger.log(`${COMMAND_NAME} link: ${link}`);

        try {
            const result = await axios.get(link, {
                responseType: "arraybuffer"
            });
            const image = {
                file: result.data,
                name: `${name}.png`,
            };
            msg.channel.createMessage("", image);
        } catch (ex) {
            if (ex instanceof(AxiosError)) {
                const exception = ex as AxiosError;
                BotLogger.error(exception.message);
            }
        }
    },
    options: {
        description: "Gets a character from NovaRO.",
        fullDescription: "Gets a character from NovaRO.",
        aliases: ["char"],
        usage: `\`!char <character name> <action# (0-${CHAR_ACTION_MAX})>/<rotation# (0-${CHAR_ROTATION_MAX})>\``,
        argsRequired: true,
        invalidUsageMessage: "`Requires at least one argument.`",
    }
};