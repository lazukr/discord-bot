import { inRange } from "../../../utils/inRange";
import { randomInteger, RandomIntegerGenerator } from "../../../utils/randomInteger";

export const SIG_POSE_MAX = 12;
export const SIG_BG_MAX = 10;

export const CHAR_ACTION_MAX = 25;
export const CHAR_ROTATION_MAX = 7;

const configRegex = /(\d*)\/(\d*)/;

export const parseCharGenArgs = (args: string[]): [string, string] => {
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

export const parseCharGenConfig = (
    config: string,
    firstArgMax: number,
    secondArgMax: number,
    randomNumGenerator: RandomIntegerGenerator = randomInteger
    ): [number, number] => {
    // empty string or null or undefined
    if (!config) {
        // return two random numbers as results
        return [
            randomNumGenerator(0, firstArgMax + 1),
            randomNumGenerator(0, secondArgMax + 1),
        ];
    }

    // attempt to split the config into a firstArg and a secondArg integer
    const [firstArg, secondArg] = config
        .split("/")
        .map(x => parseInt(x));

    // returns the firstArg and secondArg
    // if NaN, choose a random number instead
    return [
        isNaN(firstArg) || notInRange(firstArg, firstArgMax) ? randomNumGenerator(0, firstArgMax + 1) : firstArg,
        isNaN(secondArg) || notInRange(secondArg, secondArgMax) ? randomNumGenerator(0, secondArgMax + 1) : secondArg,
    ];
};

const notInRange = (value: number, max: number) => {
    return inRange(value, max) === false;
};