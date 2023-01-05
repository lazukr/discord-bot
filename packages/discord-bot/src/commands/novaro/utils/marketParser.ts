import { MarketRequest } from "./marketRequest.js";

const REFINE_FINDER = /^<?\+\d{1,2}$/;
const PRICE_FINDER = /^(\d{1,3}(\.\d{1,2})?[kmb]|\d+)$/;  

export const parseMarketArgs = (args: string[]): MarketRequest => {
    const itemId = parseInt(args[0]);
    const properties = [];
    let price = undefined;
    let refine = undefined;
    
    for (let i = 1; i < args.length; i++) {
        const arg = args[i];

        if (arg.match(PRICE_FINDER)) {
            price = priceParser(arg);
        }
        else if (arg.match(REFINE_FINDER)) {
            refine = refineParser(arg);
        }
        else {
            properties.push(args[i]);
        }
    }

    return {
        itemId: itemId,
        price: price,
        refine: refine,
        properties: properties,
    };
};

const priceParser = (price: string) => {
    const outPrice = parseFloat(price) * (
        price.includes("k") ? 1000 :
        price.includes("m") ? 1000 * 1000 :
        price.includes("b") ? 1000 * 1000 * 1000 : 1
    );
    return outPrice;
};

const refineParser = (refine: string) => {
    return parseInt(refine.replace("+", ""));
};