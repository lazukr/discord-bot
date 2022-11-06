export enum CharGenOptions {
    Char,
    Sig,
};

export interface CharGenRequest {
    name: string;
    mode: CharGenOptions;
    first: number;
    second: number;
}