import { expect, test, describe } from "@jest/globals";
import { CHARGEN_LINK, getCharGenLink } from "./charGen.js";
import { CharGenOption } from "./charGenOption.js";
import { CharGenRequest } from "./charGenRequest.js";

test("charGen creates sig links", () => {
    const chargGenRequest: CharGenRequest = {
        mode: CharGenOption.Sig,
        first: 2,
        second: 3,
        name: "test",
    };

    const expected = `${CHARGEN_LINK}/newsig/test/2/3`;
    const result = getCharGenLink(chargGenRequest).split("?")[0];
    expect(result).toBe(expected);
});

test("charGen creates char links", () => {
    const chargGenRequest: CharGenRequest = {
        mode: CharGenOption.Char,
        first: 2,
        second: 3,
        name: "test",
    };

    const expected = `${CHARGEN_LINK}/character/test/2/3`;
    const result = getCharGenLink(chargGenRequest).split("?")[0];
    expect(result).toBe(expected);
});