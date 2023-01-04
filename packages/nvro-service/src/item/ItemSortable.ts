import { ItemsResult } from "./ItemsResult.js";

export interface ItemSortable {
    sort(list: ItemsResult): ItemsResult;
}