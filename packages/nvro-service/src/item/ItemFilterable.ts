import { ItemsResult } from "./ItemsResult.js";

export interface ItemFilterable {
    filter(list: ItemsResult): ItemsResult;
}