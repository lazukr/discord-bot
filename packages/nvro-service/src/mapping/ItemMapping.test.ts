import { expect, test, describe } from "@jest/globals";
import { NvroItem } from "../dto/external/NvroItem.js";
import { NvroItemData } from "../dto/external/NvroItemData.js";
import { NvroOrder } from "../dto/external/NvroOrder.js";
import { BaseItem } from "../item/BaseItem.js";
import { ItemMapping } from "./ItemMapping.js";

const nvroCountableItem: NvroItem = {
    location: "foo",
    price: "1",
    qty: "5",
};

const nvroCountableOrder: NvroOrder = {
    location: "foo",
    price: 1,
    qty: 5,
};

const nvroCountableItemData: NvroItemData = {
    items: nvroCountableItem,
    orders: nvroCountableOrder,
};

const nvroPropertyItem: NvroItem = {
    location: "bar",
    price: "2",
    refine: "5",
    property: "bar props, car props",
};

const nvroPropertyOrder: NvroOrder = {
    location: "bar",
    price: 2,
    refine: 5,
    property: 6,
};

const nvroPropertyItemData: NvroItemData = {
    items: nvroPropertyItem,
    orders: nvroPropertyOrder,
};

test("nvro item (countable) to base item", () => {
    const expected: BaseItem = {
        location: "foo",
        price: 1,
        qty: 5,
    };
    const actual = ItemMapping.FromNvroItemDataToBaseItem(nvroCountableItemData);
    expect(actual).toMatchObject(expected);
});

test("nvro item (property) to base item", () => {
    const expected: BaseItem = {
        location: "bar",
        price: 2,
        refine: 5,
        property: ["bar props", "car props"],
    };
    const actual = ItemMapping.FromNvroItemDataToBaseItem(nvroPropertyItemData);
    expect(actual).toMatchObject(expected);
});
