import { Command } from "eris";
import { Logger } from "../../Logger";
import { DiscordBot } from "../../DiscordBot";
import { randomInteger } from "../../utils/integerRandom";

const POSE_MAX = 12;
const BG_MAX = 10;

export class NovaSigCommand extends Command {
    constructor(client: DiscordBot) {
        super("novasig", (msg, args) => {
            Logger.log(`NovaSig Command ran from ${msg.author} with args: ${args}`);
            const [name, config] = args;
            const [bg, pose] = parseCharConfig(config);
            
        }, {
            description: "Gets the signature of a character from NovaRO.",
            fullDescription: "Gets the signature of a character from NovaRO.",
            aliases: ["sig"],
            usage: "!sig <character name>",
        });
    }    
}

const parseCharConfig = (config: string): [number, number] => {
    // empty string or null or undefined
    if (!config) {
        // return two random numbers as results
        return [
            randomInteger(0, BG_MAX + 1),
            randomInteger(0, POSE_MAX + 1),
        ];
    }

    // attempt to split the config into a background and a pose integer
    const [bg, pose] = config
        .split("/")
        .map(x => parseInt(x));

    // returns the background and pose
    // if NaN, choose a random number instead
    return [
        isNaN(bg) ? randomInteger(0, BG_MAX + 1) : bg,
        isNaN(pose) ? randomInteger(0, POSE_MAX + 1) : pose,
    ];
};