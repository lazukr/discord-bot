export interface OutgoingItem {
    location: string;
    price: string;
    qty?: string;
    property?: string;
    refine?: string;
}

export interface OutgoingItemList extends Array<OutgoingItem>{};