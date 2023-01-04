import { NvroItemData } from "../dto/external/NvroItemData.js";
import { NvroItemResponse } from "../dto/external/NvroItemResponse.js";
import { BaseItem } from "../item/BaseItem.js";
import { load } from "cheerio";
import { ItemsResult } from "../item/ItemsResult.js";
  

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
    
}