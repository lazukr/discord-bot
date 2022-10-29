import { expect, test, jest } from "@jest/globals";
import { inRange } from "./inRange";

test("value within range.", () => {
    const max = 10;
    const min = 2;
    const value = 3;
    const result = inRange(value, max, min);
    expect(result).toEqual(true);
});

test("value outside range.", () => {
    const max = 10;
    const min = 3;
    const value = 12;
    const result = inRange(value, max, min);
    expect(result).toEqual(false);
});