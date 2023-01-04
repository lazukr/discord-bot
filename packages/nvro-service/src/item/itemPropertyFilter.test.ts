import { expect, test, describe } from "@jest/globals";
import { ItemPropertyFilter } from "./ItemPropertyFilter.js";
import { ItemsResult } from "./ItemsResult.js";

const foofooItem = {
    price: 5000,
    location: "foo",
    property: ["foo", "foo"],
};

const barbara1Item = {
    price: 2000,
    location: "bar",
    property: ["bar", "bar1"],
};

const foobaritem = {
    price: 4000,
    location: "foobar",
    property: ["foo", "bar"],
};

const noprops1 = {
    price: 200,
    location: "noprops1",
    qty: 5,
};

const noprops2 = {
    price: 400,
    location: "noprops2",
    qty: 15,
};

const items: ItemsResult = [
    foofooItem,
    barbara1Item,
    foobaritem,
];

const noPropsItems: ItemsResult = [
    noprops1,
    noprops2,
];

test("filters common item", () => {
    const propFilter = new ItemPropertyFilter(["bar"]);
    const result = propFilter.filter(items);
    expect(result.length).toBe(2);
    expect(result).toContain(barbara1Item);
    expect(result).toContain(foobaritem);
});

test("filters out all items", () => {
    const propFilter = new ItemPropertyFilter(["foo", "zoom"]);
    const result = propFilter.filter(items);
    expect(result.length).toBe(0);
});

test("filters repeated props", () => {
    const propFilter = new ItemPropertyFilter(["bar", "bar"]);
    const result = propFilter.filter(items);
    expect(result.length).toBe(1);
    expect(result).toContain(barbara1Item);
});

test("doesn't filter if filters are empty", () => {
    const propFilter = new ItemPropertyFilter([]);
    const result = propFilter.filter(items);
    expect(result.length).toBe(3);
    expect(result).toContain(foobaritem);
    expect(result).toContain(foofooItem);
    expect(result).toContain(barbara1Item);
});

test("doesn't filter if items have no props", () => {
    const propFilter = new ItemPropertyFilter(["foo"]);
    const result = propFilter.filter(noPropsItems);
    expect(result.length).toBe(2);
    expect(result).toContain(noprops1);
    expect(result).toContain(noprops2);
});

