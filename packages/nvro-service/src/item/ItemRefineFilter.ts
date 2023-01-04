import { ItemFilterable } from "./ItemFilterable.js";
import { ItemsResult } from "./ItemsResult.js";

export class ItemRefineFilter implements ItemFilterable {
    private refineLevel: number;
    constructor(refineLevel: number) {
        this.refineLevel = refineLevel;
    }

    filter(list: ItemsResult): ItemsResult {
        // item has no refine property, ignore filter
        if (list.every(item => item.refine === undefined)) {
            return list;
        }
        // else filter only those that have a refine level greater than the specified level
        return list.filter(item => item.refine! >= this.refineLevel);
    }
}