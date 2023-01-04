import { ItemsResult } from "./item/ItemsResult.js";
import { ItemRequest } from "./dto/internal/ItemRequest.js";
import { ItemCache } from "./ItemCache.js";
import { Manager } from "./manager/Manager.js";
import { ItemFilterable } from "./item/ItemFilterable.js";
import { ItemPriceFilter } from "./item/ItemPricefilter.js";
import { ItemPropertyFilter } from "./item/ItemPropertyFilter.js";
import { ItemSortable } from "./item/ItemSortable.js";
import { ItemPriceSorter } from "./item/ItemPriceSorter.js";
import { ServiceLogger } from "./ServiceLogger.js";
import { ItemRefineFilter } from "./item/ItemRefineFilter.js";

export class ItemManager implements Manager<ItemRequest, ItemsResult> {
    private cache: ItemCache;

    constructor(itemCache: ItemCache) {
        this.cache = itemCache;
    }

    async get(itemRequest: ItemRequest): Promise<ItemsResult> {
        if (!itemRequest) {
            throw new Error("itemRequest is not provided.");
        }

        const {
            itemId,
            price,
            refine,
            properties,
        } = itemRequest;

        if (!itemId) {
            throw new Error("itemId is not provided.");
        }

        let entries = await this.cache.get(itemId);
        const filters: ItemFilterable[] = [];

        ServiceLogger.log(`Search for ${itemId} yielded ${entries.length} result(s)`);

        if (properties && properties.length > 0) {
            const propertiesFilter = new ItemPropertyFilter(properties);
            filters.push(propertiesFilter);
        }

        if (refine) {
            const refineFilter = new ItemRefineFilter(refine);
            filters.push(refineFilter);
        }

        if (price) {
            const priceFilter = new ItemPriceFilter(price);
            filters.push(priceFilter);
        }

        while (filters.length > 0) {
            const filter = filters.pop()!;
            entries = filter.filter(entries);
        }

        const sorters: ItemSortable[] = [];
        const priceSorter = new ItemPriceSorter();
        sorters.push(priceSorter);
        while (sorters.length > 0) {
            const sort = sorters.pop()!;
            entries = sort.sort(entries);
        }        
        ServiceLogger.log(`Search for ${itemId} post filters yielded ${entries.length} result(s)`);
        return entries;
    }
}