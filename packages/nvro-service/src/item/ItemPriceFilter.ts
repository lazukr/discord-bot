import { ItemFilterable } from "./ItemFilterable.js";
import { ItemsResult } from "./ItemsResult.js";

export class ItemPriceFilter implements ItemFilterable {
    price: number;
    
    constructor(price: number) {
        this.price = price;
    }
    
    filter(list: ItemsResult): ItemsResult {
        return list.filter(item => this.price >= item.price);
    }
}