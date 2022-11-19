import axios, { AxiosError } from "axios";
import { Logger } from "../../Logger";
import { getCharGenLink } from "./utils/charGen";
import { RegisterableCommand } from "../RegisterableCommand";
import { CharGenRequest } from "./utils/charGenRequest";
import { CharGenOption } from "./utils/charGenOption";
import { parseCharGenConfig, parseCharGenArgs, SIG_BG_MAX, SIG_POSE_MAX } from "./utils/parser";

const COMMAND_NAME = "novasig";

export const NovaSigCommand: RegisterableCommand = {
    name: COMMAND_NAME,
    command: async (msg, args) => {
        Logger.log(`Command [${COMMAND_NAME}] ran from ${msg.author} with args: ${args}`);
        const [name, config] = parseCharGenArgs(args);

        if (name === null) {
            msg.channel.createMessage("Name is invalid.");
            return;
        }

        const [bg, pose] = parseCharGenConfig(config, SIG_BG_MAX, SIG_POSE_MAX);
        Logger.log(`${COMMAND_NAME} name: ${name}, bg: ${bg}, pose: ${pose}`);

        const charGenRequest: CharGenRequest = {
            name: name,
            first: bg,
            second: pose,
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
        description: "Gets the signature of a character from NovaRO.",
        fullDescription: "Gets the signature of a character from NovaRO.",
        aliases: ["sig"],
        usage: `\`!sig <character name> <bg# (0-${SIG_BG_MAX})>/<pose# (0-${SIG_POSE_MAX})>\``,
        argsRequired: true,
        invalidUsageMessage: "`Requires at least one argument.`",
    }
};