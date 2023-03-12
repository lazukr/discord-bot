import { expect, test, jest } from "@jest/globals";
import { randomInteger } from "./randomInteger.js";

test("minimum value is within range.", () => {
    const rand = () => {
        return 0;
    };
    expect(randomInteger(0, 1, rand)).toBe(0);
});

test("maximum value is within range.", () => {
    const rand = () => {
        return 1;
    };
    expect(randomInteger(0, 1, rand)).toBe(1);
});

test("random provides the expected results.", () => {
    const rand = () => {
        return 0.5;
    };
    expect(randomInteger(0, 5, rand)).toBe(2);
});