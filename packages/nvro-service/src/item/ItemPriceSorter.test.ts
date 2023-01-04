import { expect, test, describe } from "@jest/globals";
import { BaseItem } from "./BaseItem.js";
import { ItemPriceSorter } from "./ItemPriceSorter.js";

const foo = <BaseItem> {
    price: 5000,
    location: "foo",
};

const bar = <BaseItem> {
    price: 6000,
    location: "bar",
};

test("item sorts price ascending", () => {
    const list = [
        bar,
        foo,
    ];

    const sorted = [
        foo,
        bar,
    ];

    const itemPriceSorter = new ItemPriceSorter();
    const result = itemPriceSorter.sort(list);
    expect(result).toEqual(sorted);
});