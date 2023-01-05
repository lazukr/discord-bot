import { expect, test, describe } from "@jest/globals";
import { parseMarketArgs } from "./marketParser.js";

describe("item id", () => {
    test("is NaN when invalid", () => {
        const args = ["test"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: NaN,
            price: undefined,
            refine: undefined,
            properties: [],
        });
    });

    test("is a number when valid", () => {
        const args = ["521"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: undefined,
            refine: undefined,
            properties: [],
        });
    });
});

describe("price value", () => {
    test("is not set when not valid", () => {
        const args = ["521", "test"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: undefined,
            refine: undefined,
            properties: ["test"],
        });
    });

    test("is set to number when a number", () => {
        const args = ["521", "500"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: 500,
            refine: undefined,
            properties: [],
        });
    });

    test("does not parse decimal when no suffix", () => {
        const args = ["521", "5.5"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: undefined,
            refine: undefined,
            properties: ["5.5"],
        });
    });

    test("converts k to thousands when in format of #k", () => {
        const args = ["521", "5k"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: 5000,
            refine: undefined,
            properties: [],
        });
    });

    test("converts k to thousands and decimal when in format of #k", () => {
        const args = ["521", "5.52k"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: 5520,
            refine: undefined,
            properties: [],
        });
    });

    test("does not interpret #k when more than 3 leading places", () => {
        const args = ["521", "5422k"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: undefined,
            refine: undefined,
            properties: ["5422k"],
        });
    });

    test("does not interpret #k when more than 2 decimal places", () => {
        const args = ["521", "5.422k"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: undefined,
            refine: undefined,
            properties: ["5.422k"],
        });
    });

    test("converts m to millions and decimal when in format of #m", () => {
        const args = ["521", "5.5m"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: 5500000,
            refine: undefined,
            properties: [],
        });
    });

    test("converts b to billions and decimal when in format of #b", () => {
        const args = ["521", "5.5b"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: 5500000000,
            refine: undefined,
            properties: [],
        });
    });
});

describe("refine value", () => {
    test("is not set when not valid", () => {
        const args = ["521", "test"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: undefined,
            refine: undefined,
            properties: ["test"],
        });
    });

    test("is set when valid", () => {
        const args = ["521", "+5"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: undefined,
            refine: 5,
            properties: [],
        });
    });

    test("goes up to 2 digits", () => {
        const args = ["521", "+20"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: undefined,
            refine: 20,
            properties: [],
        });
    });

    test("does not interpret 3 digits", () => {
        const args = ["521", "+200"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: undefined,
            refine: undefined,
            properties: ["+200"],
        });
    });
});

describe("multiple components parsed correctly", () => {
    test("price and refine", () => {
        const args = ["521", "5k", "+2"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: 5000,
            refine: 2,
            properties: [],
        });
    });

    test("price and properties", () => {
        const args = ["521", "5k", "test", "hello"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: 5000,
            refine: undefined,
            properties: ["test", "hello"],
        });
    });

    test("refine and properties", () => {
        const args = ["521", "+4", "test", "hello"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: undefined,
            refine: 4,
            properties: ["test", "hello"],
        });
    });

    test("price, refine and properties", () => {
        const args = ["521", "5.5m", "+4", "test", "hello"];
        const result = parseMarketArgs(args);
        expect(result).toStrictEqual({
            itemId: 521,
            price: 5500000,
            refine: 4,
            properties: ["test", "hello"],
        });
    });
});