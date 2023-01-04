import { expect, test, describe } from "@jest/globals";
import { BaseItem } from "./BaseItem.js";
import { ItemRefineFilter } from "./ItemRefineFilter.js";

const itemRefineFilter = new ItemRefineFilter(5);
const noRefineFoo = <BaseItem> {
    location: "no refine foo",
    price: 500,
};
const noRefineBar = <BaseItem> {
    location: "no refine bar",
    price: 100,
};

const foo = <BaseItem> {
    location: "foo",
    price: 600,
    refine: 4,
};

const bar = <BaseItem> {
    location: "bar",
    price: 200,
    refine: 3,
};

const baz = <BaseItem> {
    location: "baz",
    price: 300,
    refine: 7,
};

const qux = <BaseItem> {
    location: "qux",
    price: 700,
    refine: 5,
};


test("item refine does not filter items with no refine level", () => {
    const list = [
        noRefineFoo,
        noRefineBar,
    ];

    const result = itemRefineFilter.filter(list);
    expect(result).toEqual(list);
});



test("item refine filters anything below refine level", () => {
    const list = [
        foo,
        bar,
        baz,
        qux,
    ];

    const expected = [
        baz,
        qux,
    ];

    const result = itemRefineFilter.filter(list);
    expect(result).toEqual(expected);
});

test("item refine returns empty when everything is below refine level", () => {
    const list = [
        foo,
        bar,
    ];

    const result = itemRefineFilter.filter(list);
    expect(result.length).toBe(0);
});