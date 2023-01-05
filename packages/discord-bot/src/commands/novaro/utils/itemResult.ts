export interface ItemResult {
    price: string;
    location: string;
    refine?: string;
    property?: string;
    qty?: string;
};

export interface ItemResultList extends Array<ItemResult>{};