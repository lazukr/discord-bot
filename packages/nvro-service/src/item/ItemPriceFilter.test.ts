import { expect, test, describe } from "@jest/globals";
import { ItemPriceFilter } from "./ItemPricefilter.js";
import { ItemsResult } from "./ItemsResult.js";

const item1 = {
    price: 5000,
    location: "foo",
};

const item2 = {
    price: 23000,
    location: "bar",
};
const items: ItemsResult = [
    item1,
    item2,
];
test("filters on price", () => {
    const itemFilter = new ItemPriceFilter(9000);
    const result = itemFilter.filter(items);
    expect(result.length).toBe(1);
    expect(result).toContain(item1);
});

test("no price below filter", () => {
    const itemFilter = new ItemPriceFilter(2000);
    const result = itemFilter.filter(items);
    expect(result.length).toBe(0);
});

test("all prices below filter", () => {
    const itemFilter = new ItemPriceFilter(25000);
    const result = itemFilter.filter(items);
    expect(result.length).toBe(2);
    expect(result).toContain(item1);
    expect(result).toContain(item2);
});
