import { ItemResult, ItemResultList } from "./itemResult.js";

const PRICE = "price";
const QTY = "qty";
const REFINE = "+";
const PROPS = "+props";
const LOCATION = "location";

const DISCORD_MESSAGE_LIMIT = 1800;

export const marketPrettyPrinter = (itemResultList: ItemResultList): string[] => {
    const locationTransformed = itemResultList.map(item => {
        return transformLocationData(item);
    });
    const paddedTransformed = padItemData(locationTransformed);
    const rows = rowAggregate(paddedTransformed);

    const rowLength = rows[0].length;

    if (rowLength === 0) {
        return ["```ml\nNo results.```"];
    }

    const maxRowsPerMessage = Math.floor(DISCORD_MESSAGE_LIMIT / rowLength);
    const messages = [];
    for (let i = 0; i < rows.length; i += maxRowsPerMessage) {
        messages.push(rows.slice(i, i + maxRowsPerMessage));
    }

    return messages.map(message => {
        return `\`\`\`ml\n${message.join("\n")}\`\`\``;
    });
};

const transformLocationData = (itemResult: ItemResult) => {
    const location = itemResult.location
        .trim()
        .split(",");

    const transformedLocation = location[0] === "nova_vend" ?
        `@sj ${location[1]} ${location[2]}` :
        `@navi ${location[0]} ${location[1]}/${location[2]}`;

    itemResult.location = transformedLocation;
    return itemResult;
};

const rowAggregate = (itemResultList: ItemResultList) => {
    return itemResultList.map(item => {
        return `${item.price}  ${item.qty ? item.qty + "  " : ""}${item.refine ? item.refine + "  " : ""}${item.property ? item.property + "  " : ""}${item.location}`.trim(); 
    });
};

const padItemData = (itemResultList: ItemResultList): ItemResultList => {
    const maxEntryLengths = {
        price: 0,
        location: 0,
        property: 0,
        qty: 0,
        refine: 0,
    };

    itemResultList.forEach(item => {
        if (item.location.length > maxEntryLengths.location) {
            maxEntryLengths.location = item.location.length;
        }

        if (item.price.length > maxEntryLengths.price) {
            maxEntryLengths.price = item.price.length;
        }

        if ((item.property?.length ?? 0) > maxEntryLengths.property) {
            maxEntryLengths.property = item.property!.length;
        }

        if ((item.qty?.length ?? 0) > maxEntryLengths.qty) {
            maxEntryLengths.qty = item.qty!.length;
        }

        if ((item.refine?.length ?? 0) > maxEntryLengths.refine) {
            maxEntryLengths.refine = item.refine!.length;
        }
    });

    const header = {
        price: maxEntryLengths.price > 0 ? PRICE.padEnd(maxEntryLengths.price) : "",
        qty: maxEntryLengths.qty > 0 ? QTY.padEnd(maxEntryLengths.qty) : "",
        refine: maxEntryLengths.refine > 0 ? REFINE.padEnd(maxEntryLengths.refine) : "",
        property: maxEntryLengths.property > 0 ? PROPS.padEnd(maxEntryLengths.property) : "",
        location: maxEntryLengths.location > 0  ? LOCATION.padEnd(maxEntryLengths.location) : "",
    };

    const divider = {
        price: "-".repeat(maxEntryLengths.price),
        qty: "-".repeat(maxEntryLengths.qty),
        refine: "-".repeat(maxEntryLengths.refine),
        property: "-".repeat(maxEntryLengths.property),
        location: "-".repeat(maxEntryLengths.location),
    };

    const paddedResult = itemResultList.map(item => {
        const {
            price,
            location,
            property,
            qty,
            refine,
        } = item;

        return {
            price: price.padEnd(maxEntryLengths.price),
            qty: qty ? qty!.padEnd(maxEntryLengths.qty) : "",
            refine: refine ? refine.padEnd(maxEntryLengths.refine) : "",
            property: property ? property!.padEnd(maxEntryLengths.property) : "",
            location: location.padEnd(maxEntryLengths.location),
        };
    });

    return [header, divider, ...paddedResult];
};