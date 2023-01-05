export interface MarketRequest {
    itemId: number;
    price?: number;
    properties: string[];
    refine?: number;
};