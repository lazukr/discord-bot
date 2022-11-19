import { CharGenOption } from "./charGenOption";
import { CharGenRequest } from "./charGenRequest";

export const CHARGEN_LINK = "https://www.novaragnarok.com/ROChargenPHP";
const getCharGen = (option: CharGenOption) : "character" | "newsig" => {
    return option === CharGenOption.Char ? "character" : "newsig";
};

export const getCharGenLink = (request: CharGenRequest) => {
    const {
        mode,
        first,
        second,
        name,
    } = request;
    return `${CHARGEN_LINK}/${getCharGen(mode)}/${name}/${first}/${second}?${Date.now()}`;
};