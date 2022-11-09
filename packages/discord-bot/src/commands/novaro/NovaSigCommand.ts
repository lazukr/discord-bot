import axios, { Axios, AxiosError } from "axios";
import { Logger } from "../../Logger";
import { randomInteger, RandomIntegerGenerator } from "../../utils/randomInteger";
import { inRange } from "../../utils/inRange";
import { getCharGenLink } from "./utils/charGen";
import { RegisterableCommand } from "../RegisterableCommand";
import { FileContent } from "eris";
import { CharGenRequest } from "./utils/charGenRequest";
import { CharGenOption } from "./utils/charGenOption";

export const POSE_MAX = 12;
export const BG_MAX = 10;

const configRegex = /(\d*)\/(\d*)/;

export const NovaSigCommand: RegisterableCommand = {
    name: "novasig",
    command: async (msg, args) => {
        Logger.log(`NovaSig Command ran from ${msg.author} with args: ${args}`);
        const [name, config] = parseSigArgs(args);

        if (name === null) {
            msg.channel.createMessage("Name is invalid.");
            return;
        }

        const [bg, pose] = parseCharConfig(config);
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

export const parseSigArgs = (args: string[]): [string, string] => {
    // if only one argument, it has to be name
    if (args.length === 1) {
        return [args[0], ""];
    }
    const lastArg = args[args.length - 1];
    const match = lastArg!.match(configRegex);
    const config =  match ? lastArg : "";
    const name = match ? args.slice(0, -1).join("_") : args.join("_");
    return [name, config];
};

export const parseCharConfig = (
    config: string,
    randomNumGenerator: RandomIntegerGenerator = randomInteger
    ): [number, number] => {
    // empty string or null or undefined
    if (!config) {
        // return two random numbers as results
        return [
            randomNumGenerator(0, BG_MAX + 1),
            randomNumGenerator(0, POSE_MAX + 1),
        ];
    }

    // attempt to split the config into a background and a pose integer
    const [bg, pose] = config
        .split("/")
        .map(x => parseInt(x));

    // returns the background and pose
    // if NaN, choose a random number instead
    return [
        isNaN(bg) || notInRange(bg, BG_MAX) ? randomNumGenerator(0, BG_MAX + 1) : bg,
        isNaN(pose) || notInRange(pose, POSE_MAX) ? randomNumGenerator(0, POSE_MAX + 1) : pose,
    ];
};

const notInRange = (value: number, max: number) => {
    return inRange(value, max) === false;
};