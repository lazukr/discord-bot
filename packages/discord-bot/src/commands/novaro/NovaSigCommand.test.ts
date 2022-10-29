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


});