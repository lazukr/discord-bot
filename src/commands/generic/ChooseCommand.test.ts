import { expect, test } from "@jest/globals";
import { RandomIntegerGenerator } from "../../utils/randomInteger.js";
import { choose } from "./ChooseCommand.js";

test("Empty input does not return any result.", () => {
	const args: string[] = [];
	expect(choose(args)).toBe("No items to choose from.");
});

test("Same item return if only one item.", () => {
	const args: string[] = ["test"];
	expect(choose(args)).toBe("test");
});

test("Selects an item in the list.", () => {
	const args: string[] = ["test,", "help"];
	const randomResult: RandomIntegerGenerator = (min, max) => {
		return max;
	};

	expect(choose(args, randomResult)).toBe("help");
});
