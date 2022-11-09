import { CharGenOption } from "./charGenOption";

export interface CharGenRequest {
    name: string;
    mode: CharGenOption;
    first: number;
    second: number;
}