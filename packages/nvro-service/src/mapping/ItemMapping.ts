import { NvroItemData } from "../dto/external/NvroItemData.js";
import { NvroItemResponse } from "../dto/external/NvroItemResponse.js";
import { BaseItem } from "../item/BaseItem.js";
import { load } from "cheerio";
import { ItemsResult } from "../item/ItemsResult.js";
import { OutgoingItem, OutgoingItemList } from "../item/OutgoingItem.js";
  

export class ItemMapping {
    static FromNvroDataToItem(nvroItemResponse: NvroItemResponse): ItemsResult  {
        return this.FromNvroItemListToBaseItemList(nvroItemResponse.data);
    }

    static FromNvroItemListToBaseItemList(nvroItemData: NvroItemData[]): ItemsResult {
        return nvroItemData.map(item => this.FromNvroItemDataToBaseItem(item));
    }

    static FromNvroItemDataToBaseItem(nvroItemData: NvroItemData): BaseItem {
        const result = nvroItemData.orders as BaseItem;
        if (nvroItemData.items.property) {
            result.property = nvroItemData.items.property
            .split(",")
            .map(prop => load(prop).text().trim());
        }
        return result;
    }

    static FromBaseItemToOutgoingItem(baseItem: BaseItem): OutgoingItem {
        const {
            price,
            location,
            property,
            qty,
            refine,
        } = baseItem;

        return {
            price: price.toLocaleString(),
            location: location,
            property: property?.join(", "),
            qty: qty?.toLocaleString(),
            refine: refine?.toLocaleString(),
        };
    }

    static FromItemResultToOutgoingItemList(itemResult: ItemsResult): OutgoingItemList {
        return itemResult.map(item => this.FromBaseItemToOutgoingItem(item));
    }
}