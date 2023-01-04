import { ItemMapping } from "../mapping/ItemMapping.js";
import { ServiceLogger } from "../ServiceLogger.js";
import { BaseItem } from "./BaseItem.js";
import { ItemFilterable } from "./ItemFilterable.js";
import { ItemsResult } from "./ItemsResult.js";

export class ItemPropertyFilter implements ItemFilterable {
    properties: string[];
    
    constructor(properties: string[]) {
        this.properties = properties;
    }
    
    filter(list: ItemsResult): ItemsResult {
        // no properties to sort on, return all
        if (this.properties.length === 0) {
            return list;
        }

        if (list.every(item => item.property === undefined)) {
            return list;
        }

        const result = list.filter(item => {
            // get property we're filtering on and what we have right now
            const filters = this.properties.map(i => i.toLowerCase());
            const props = item.property!.map(i => i.toLowerCase());
            let count = 0;
            // go through the filtering properties
            for (let i = 0; i < filters.length; i++) {
                // loop through the current properties
                // see if we get a match
                // if matched, remove it from array and end loop
                for (let j = 0; j < props.length; j++) {
                    if (props[j].includes(filters[i])) {
                        props.splice(j, 1);
                        count++;
                        break;
                    }
                }
            }
            
            // at the end of the loop
            // if count is the same as filter length
            // then we matched everything
            return this.properties.length === count;
        });

        return result;
    }   
}