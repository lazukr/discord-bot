import { ItemSortable } from "./ItemSortable.js";
import { ItemsResult } from "./ItemsResult.js";

export class ItemPriceSorter implements ItemSortable {
    sort(list: ItemsResult): ItemsResult {
        return list.sort((a, b) => a.price - b.price);
    }
}