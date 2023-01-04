import { ItemsResult } from "./item/ItemsResult.js";
import { Cache, ItemCacheRetrievefunction } from "./cache/Cache.js";
import { CacheConfig } from "./cache/CacheConfig.js";

export class ItemCache implements Cache<number, ItemsResult> {
    private cache: {[id: number]: [number, ItemsResult]};
    private cacheDuration: number;
    private retrieveFunc: ItemCacheRetrievefunction<number, ItemsResult>;

    constructor(cacheConfig: CacheConfig, retrieveFunc: ItemCacheRetrievefunction<number, ItemsResult>) {
        this.cache = {};
        this.cacheDuration = cacheConfig.cacheDuration;
        this.retrieveFunc = retrieveFunc;
    }

    async get(id: number): Promise<ItemsResult> {
        if (this.cache[id]) {
            const [date, result] = this.cache[id];
            const duration = Date.now() - date.valueOf();
            if (duration > this.cacheDuration) {
                // expired cache
                delete this.cache[id];
            } else {
                return result;
            }
        }

        const retreived = await this.retrieve(id);
        this.cache[id] = [Date.now(), retreived];
        return retreived;
        
    }
    async retrieve(id: number): Promise<ItemsResult> {
        return await this.retrieveFunc(id);
    }

}