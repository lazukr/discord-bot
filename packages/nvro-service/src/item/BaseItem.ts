export interface BaseItem extends Record<string, unknown> {
    location: string;
    price: number;
    qty?: number;
    property?: string[];
    refine?: number;
}