import { expect, test, describe } from "@jest/globals";
import { parseCharGenArgs, parseCharGenConfig, SIG_BG_MAX, SIG_POSE_MAX } from "./parser";

describe("test parseSigArgs", () => {
    test("name only.", () => {
        const args = ["test"];
        const [name, config] = parseCharGenArgs(args);
        expect(name).toBe("test");
        expect(config).toBe("");
    });

    test("config only.", () => {
        const args = ["a/a"];
        const [name, config] = parseCharGenArgs(args);
        expect(name).toBe("a/a");
        expect(config).toBe("");
    });

    test("name with space.", () => {
        const args = ["test", "hello"];
        const [name, config] = parseCharGenArgs(args);
        expect(name).toBe("test_hello");
        expect(config).toBe("");
    });

    test("name with config.", () => {
        const args = ["test", "a/b"];
        const [name, config] = parseCharGenArgs(args);
        expect(name).toBe("test");
        expect(config).toBe("a/b");
    });

    test("name with partial config (a/).", () => {
        const args = ["test", "a/"];
        const [name, config] = parseCharGenArgs(args);
        expect(name).toBe("test");
        expect(config).toBe("a/");
    });

    test("name with partial config (/a).", () => {
        const args = ["test", "/a"];
        const [name, config] = parseCharGenArgs(args);
        expect(name).toBe("test");
        expect(config).toBe("/a");
    });

    test("multi space name with config.", () => {
        const args = ["hello", "world", "a/b"];
        const [name, config] = parseCharGenArgs(args);
        expect(name).toBe("hello_world");
        expect(config).toBe("a/b");
    });
});

describe("test parseCharConfig", () => {
    test("config is empty.", () => {
        const config = "";
        const result = parseCharGenConfig(config, SIG_BG_MAX, SIG_POSE_MAX);
        result.every(e => expect(e).toEqual(expect.any(Number)));
    });

    test("config is #/.", () => {
        const config = "5/";
        const result = parseCharGenConfig(config, SIG_BG_MAX, SIG_POSE_MAX);
        expect(result[0]).toBe(5);
        expect(result[1]).toEqual(expect.any(Number));
    });

    test("config is /#.", () => {
        const config = "/6";
        const result = parseCharGenConfig(config, SIG_BG_MAX, SIG_POSE_MAX);
        expect(result[0]).toEqual(expect.any(Number));
        expect(result[1]).toBe(6);
    });

    test("config is /.", () => {
        const config = "/";
        const result = parseCharGenConfig(config, SIG_BG_MAX, SIG_POSE_MAX);
        expect(result[0]).toEqual(expect.any(Number));
        expect(result[1]).toEqual(expect.any(Number));
    });

    test("config bg is over the limits.", () => {
        const config = `${SIG_BG_MAX + 1}/5`;
        const result = parseCharGenConfig(config, SIG_BG_MAX, SIG_POSE_MAX);
        expect(result[0]).toBeLessThanOrEqual(SIG_BG_MAX);
        expect(result[0]).toBeGreaterThanOrEqual(0);
    });

    test("config pose is over the limits.", () => {
        const config = `5/${SIG_POSE_MAX + 1}`;
        const result = parseCharGenConfig(config, SIG_BG_MAX, SIG_POSE_MAX);
        expect(result[1]).toBeLessThanOrEqual(SIG_POSE_MAX);
        expect(result[1]).toBeGreaterThanOrEqual(0);
    });
});