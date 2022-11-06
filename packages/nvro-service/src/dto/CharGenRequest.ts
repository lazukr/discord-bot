export enum CharGenOptions {
    Char,
    Sig,
};

export const GetCharGen = (option: CharGenOptions): "character" | "newsig" => {
    if (option === CharGenOptions.Char) {
        return "character";
    }
    return "newsig";
};

export interface CharGenRequest {
    name: string;
    mode: CharGenOptions;
    first: number;
    second: number;
}