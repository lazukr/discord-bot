import { expect, test } from "@jest/globals";
import { DELETE_TYPE, tryParseDeleteInput, tryParseQueueInput, WHEN_TYPE } from "./ReminderCommand.js";

test("try parse input returns false when no matches found.", () => {
    const args = ["hello", "world"];
    const {
        success,
        when,
        message,
        type,
    } = tryParseQueueInput(args);
    expect(success).toBe(false);
    expect(message).toBe("");
    expect(when).toBe("");
    expect(type).toBe(WHEN_TYPE.NEITHER);
});

test("try parse input returns in case when found.", () => {
    const args = ["hello", "world", "in", "10", "minutes"];
    const {
        success,
        when,
        message,
        type,
    } = tryParseQueueInput(args);
    expect(success).toBe(true);
    expect(message).toBe("hello world");
    expect(when).toBe("in 10 minutes");
    expect(type).toBe(WHEN_TYPE.IN);
});

test("try parse input returns last in case when multiple are found.", () => {
    const args = ["hello", "world", "in", "dreams", "in", "10", "minutes"];
    const {
        success,
        when,
        message,
        type,
    } = tryParseQueueInput(args);
    expect(success).toBe(true);
    expect(message).toBe("hello world in dreams");
    expect(when).toBe("in 10 minutes");
    expect(type).toBe(WHEN_TYPE.IN);
});

test("try parse input returns last at case when multiple are found.", () => {
    const args = ["hello", "at", "world", "at", "5", "pm"];
    const {
        success,
        when,
        message,
        type,
    } = tryParseQueueInput(args);
    expect(success).toBe(true);
    expect(message).toBe("hello at world");
    expect(when).toBe("at 5 pm");
    expect(type).toBe(WHEN_TYPE.AT);
});

test("try parse input returns the latter of two cases if both found (at).", () => {
    const args = ["hello", "world", "in", "glory", "at", "5", "pm"];
    const {
        success,
        when,
        message,
        type,
    }= tryParseQueueInput(args);
    expect(success).toBe(true);
    expect(message).toBe("hello world in glory");
    expect(when).toBe("at 5 pm");
    expect(type).toBe(WHEN_TYPE.AT);
});

test("try parse input returns the latter of two cases if both found (in).", () => {
    const args = ["hello", "world", "at", "dreams", "in", "5", "minutes"];
    const {
        success,
        when,
        message,
        type,
    } = tryParseQueueInput(args);
    expect(success).toBe(true);
    expect(message).toBe("hello world at dreams");
    expect(when).toBe("in 5 minutes");
    expect(type).toBe(WHEN_TYPE.IN);
});

test("try parse delete returns index version.", () => {
    const args = "3";
    const {
        type,
        result,
    } = tryParseDeleteInput(args);
    expect(result).toBe(3);
    expect(type).toBe(DELETE_TYPE.INDEX);
});

test("try parse delete returns id version.", () => {
    const args = "6423ce09353eabd58dd05e0c";
    const {
        type,
        result,
    } = tryParseDeleteInput(args);
    expect(result).toBe("6423ce09353eabd58dd05e0c");
    expect(type).toBe(DELETE_TYPE.ID);
});