import { CharGenOption } from "./charGenOption.js";

export interface CharGenRequest {
    name: string;
    mode: CharGenOption;
    first: number;
    second: number;
}