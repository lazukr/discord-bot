export interface ItemRequest {
    itemId: number;
    price?: number;
    refine?: number;
    properties?: string[];
}