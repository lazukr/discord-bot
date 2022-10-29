import { expect, test, describe } from "@jest/globals";
import { parseSigArgs, parseCharConfig, BG_MAX, POSE_MAX } from "./NovaSigCommand";

describe("test parseSigArgs", () => {
    test("name only.", () => {
        const args = ["test"];
        const [name, config] = parseSigArgs(args);
        expect(name).toBe("test");
        expect(config).toBe("");
    });

    test("config only.", () => {
        const args = ["a/a"];
        const [name, config] = parseSigArgs(args);
        expect(name).toBe("a/a");
        expect(config).toBe("");
    });

    test("name with space.", () => {
        const args = ["test", "hello"];
        const [name, config] = parseSigArgs(args);
        expect(name).toBe("test_hello");
        expect(config).toBe("");
    });

    test("name with config.", () => {
        const args = ["test", "a/b"];
        const [name, config] = parseSigArgs(args);
        expect(name).toBe("test");
        expect(config).toBe("a/b");
    });

    test("name with partial config (a/).", () => {
        const args = ["test", "a/"];
        const [name, config] = parseSigArgs(args);
        expect(name).toBe("test");
        expect(config).toBe("a/");
    });

    test("name with partial config (/a).", () => {
        const args = ["test", "/a"];
        const [name, config] = parseSigArgs(args);
        expect(name).toBe("test");
        expect(config).toBe("/a");
    });

    test("multi space name with config.", () => {
        const args = ["hello", "world", "a/b"];
        const [name, config] = parseSigArgs(args);
        expect(name).toBe("hello_world");
        expect(config).toBe("a/b");
    });
});

describe("test parseCharConfig", () => {
    test("config is empty.", () => {
        const config = "";
        const result = parseCharConfig(config);
        result.every(e => expect(e).toEqual(expect.any(Number)));
    });

    test("config is #/.", () => {
        const config = "5/";
        const result = parseCharConfig(config);
        expect(result[0]).toBe(5);
        expect(result[1]).toEqual(expect.any(Number));
    });

    test("config is /#.", () => {
        const config = "/6";
        const result = parseCharConfig(config);
        expect(result[0]).toEqual(expect.any(Number));
        expect(result[1]).toBe(6);
    });

    test("config is /.", () => {
        const config = "/";
        const result = parseCharConfig(config);
        expect(result[0]).toEqual(expect.any(Number));
        expect(result[1]).toEqual(expect.any(Number));
    });

    test("config bg is over the limits.", () => {
        const config = `${BG_MAX + 1}/5`;
        const result = parseCharConfig(config);
        expect(result[0]).toBeLessThanOrEqual(BG_MAX);
        expect(result[0]).toBeGreaterThanOrEqual(0);
    });

    test("config pose is over the limits.", () => {
        const config = `5/${POSE_MAX + 1}`;
        const result = parseCharConfig(config);
        expect(result[1]).toBeLessThanOrEqual(POSE_MAX);
        expect(result[1]).toBeGreaterThanOrEqual(0);
    });
});