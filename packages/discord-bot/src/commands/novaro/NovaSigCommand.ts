import axios, { AxiosError } from "axios";
import { Logger } from "../../Logger";
import { getCharGenLink } from "./utils/charGen";
import { RegisterableCommand } from "../RegisterableCommand";
import { CharGenRequest } from "./utils/charGenRequest";
import { CharGenOption } from "./utils/charGenOption";
import { parseCharConfig, parseSigArgs, SIG_BG_MAX, SIG_POSE_MAX } from "./utils/parser";

export const NovaSigCommand: RegisterableCommand = {
    name: "novasig",
    command: async (msg, args) => {
        Logger.log(`NovaSig Command ran from ${msg.author} with args: ${args}`);
        const [name, config] = parseSigArgs(args);

        if (name === null) {
            msg.channel.createMessage("Name is invalid.");
            return;
        }

        const [bg, pose] = parseCharConfig(config, SIG_BG_MAX, SIG_POSE_MAX);
        Logger.log(`NovaSig name: ${name}, bg: ${bg}, pose: ${pose}`);

        const charGenRequest: CharGenRequest = {
            name: name,
            first: bg,
            second: pose,
            mode: CharGenOption.Sig
        };

        const link = getCharGenLink(charGenRequest);
        Logger.log(`Novasig link: ${link}`);

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
            msg.channel.createMessage("Something went wrong.");
        }
    },
    options: {
        description: "Gets the signature of a character from NovaRO.",
        fullDescription: "Gets the signature of a character from NovaRO.",
        aliases: ["sig"],
        usage: "`!sig <character name> <pose#>/<bg#>`",
        argsRequired: true,
        invalidUsageMessage: "`Requires at least one argument.`",
    }
};