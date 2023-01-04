import { expect, test, jest, afterEach } from "@jest/globals";
import { ItemCacheRetrievefunction } from "./cache/Cache.js";
import { CacheConfig } from "./cache/CacheConfig.js";
import { BaseItem } from "./item/BaseItem.js";
import { ItemsResult } from "./item/ItemsResult.js";
import { ItemCache } from "./ItemCache.js";

const foo = [<BaseItem> {
    location: "foo",
    price: 200,
}];
const bar = [<BaseItem> {
    location: "bar",
    price: 400,
}];
const baz = [<BaseItem> {
    location: "baz",
    price: 500,
}];

const retrieveFunc: ItemCacheRetrievefunction<number, ItemsResult> = jest.fn((key: number) => {
    switch (key) {
        case 1: {
            return new Promise<ItemsResult>((resolve) => {
                resolve(foo);                
            });
        }

        case 2: {
            return new Promise<ItemsResult>((resolve) => {
                resolve(bar);                
            });
        }
        default: {
            return new Promise<ItemsResult>((resolve) => {
                resolve(baz);                
            });
        }
    }
});

const delay = (ms: number) =>  {
    return new Promise( resolve => setTimeout(resolve, ms) );
};

test("item cache retrieves item if it does not exist", async () => {
    const config = <CacheConfig> {
        cacheDuration: 1000,
    };
    const cache = new ItemCache(config, retrieveFunc);
    const actualfoo = await cache.get(1);
    expect(actualfoo).toEqual(foo);
    expect(retrieveFunc).toBeCalled();
});

test("item cache retrieves from cache when in cache", async () => {
    const config = <CacheConfig> {
        cacheDuration: 1000,
    };
    const cache = new ItemCache(config, retrieveFunc);

    await cache.get(1);
    const actualfoo = await cache.get(1);
    expect(actualfoo).toEqual(foo);
    expect(retrieveFunc).toBeCalledTimes(1);
});

test("item cache gets for different items", async () => {
    const config = <CacheConfig> {
        cacheDuration: 1000,
    };
    const cache = new ItemCache(config, retrieveFunc);
    const actualfoo = await cache.get(1);
    expect(actualfoo).toEqual(foo);
    const actualbar = await cache.get(2);
    expect(actualbar).toEqual(bar);
    expect(retrieveFunc).toBeCalledTimes(2);
});

test("item cache expires", async () => {
    const config = <CacheConfig> {
        cacheDuration: 1,
    };
    const cache = new ItemCache(config, retrieveFunc);
    const actualfoo = await cache.get(1);
    expect(actualfoo).toEqual(foo);
    expect(retrieveFunc).toBeCalledTimes(1);
    await delay(2);
    const actualfoo2 = await cache.get(1);
    expect(actualfoo2).toEqual(foo);
    expect(retrieveFunc).toBeCalledTimes(2);
});


afterEach(() => {
    jest.clearAllMocks();
});