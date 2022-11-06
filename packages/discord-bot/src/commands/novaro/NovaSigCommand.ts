import axios from "axios";
import { Logger } from "../../Logger";
import { randomInteger, RandomIntegerGenerator } from "../../utils/randomInteger";
import { inRange } from "../../utils/inRange";
import { CharGenOptions, CharGenRequest } from "../../dto/charGenRequest";
import { RegisterableCommand } from "../RegisterableCommand";

export const POSE_MAX = 12;
export const BG_MAX = 10;

const configRegex = /(\d*)\/(\d*)/;

export const NovaSigCommand: RegisterableCommand = {
    name: "novasig",
    command: async (msg, args) => {
        Logger.log(`NovaSig Command ran from ${msg.author} with args: ${args}`);
            
        if (args.length === 0) {
            return "no args";
        }

        const [name, config] = parseSigArgs(args);

        if (name === null) {
            // handle this
            return "name is null";
        }

        const [bg, pose] = parseCharConfig(config);
        Logger.log(`NovaSig name: ${name}, bg: ${bg}, pose: ${pose}`);

        const charGenRequest: CharGenRequest = {
            name: name,
            first: bg,
            second: pose,
            mode: CharGenOptions.Sig
        };
        
        const res = await axios.post("/chargen", charGenRequest);
        console.log(res.data);

        return {
            content: "test"
        };
    },
    options: {
        description: "Gets the signature of a character from NovaRO.",
        fullDescription: "Gets the signature of a character from NovaRO.",
        aliases: ["sig"],
        usage: "!sig <character name>",
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