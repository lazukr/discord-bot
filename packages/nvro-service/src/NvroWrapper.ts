
import Axios from "axios";
import { BaseItem } from "./item/BaseItem.js";
import { ItemsResult } from "./item/ItemsResult.js";
import { ItemMapping } from "./mapping/ItemMapping.js";

const MARKET_LINK = "https://www.novaragnarok.com/data/cache/ajax/item_*.json";

export class NvroWrapper {
    static async getItemById(id: number): Promise<ItemsResult> {
        const link = MARKET_LINK.replace("*", id.toString());
        const { data } = await Axios.get(link, {
            responseType: "json",
            headers: {
                "Accept-Encoding": "application/json",
            }
        });
        const results = ItemMapping.FromNvroItemListToBaseItemList(data.data);
        return results;
    }
}