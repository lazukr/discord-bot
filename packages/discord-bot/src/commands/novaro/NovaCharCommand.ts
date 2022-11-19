import axios, { AxiosError } from "axios";
import { Logger } from "../../Logger";
import { getCharGenLink } from "./utils/charGen";
import { RegisterableCommand } from "../RegisterableCommand";
import { CharGenRequest } from "./utils/charGenRequest";
import { CharGenOption } from "./utils/charGenOption";
import { parseCharConfig, parseSigArgs, CHAR_ACTION_MAX, CHAR_ROTATION_MAX } from "./utils/parser";

const COMMAND_NAME = "novachar";

export const NovaSigCommand: RegisterableCommand = {
    name: COMMAND_NAME,
    command: async (msg, args) => {
        Logger.log(`Command [${COMMAND_NAME}] ran from ${msg.author} with args: ${args}`);
        const [name, config] = parseSigArgs(args);

        if (name === null) {
            msg.channel.createMessage("Name is invalid.");
            return;
        }

        const [action, rotation] = parseCharConfig(config, CHAR_ACTION_MAX, CHAR_ROTATION_MAX);
        Logger.log(`${COMMAND_NAME} name: ${name}, bg: ${action}, pose: ${rotation}`);

        const charGenRequest: CharGenRequest = {
            name: name,
            first: action,
            second: rotation,
            mode: CharGenOption.Sig
        };

        const link = getCharGenLink(charGenRequest);
        Logger.log(`${COMMAND_NAME} link: ${link}`);

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
                Logger.error(exception.message);
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