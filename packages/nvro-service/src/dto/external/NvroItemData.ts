import { NvroItem } from "./NvroItem.js";
import { NvroOrder } from "./NvroOrder.js";

export interface NvroItemData {
    items: NvroItem;
    orders: NvroOrder;
}