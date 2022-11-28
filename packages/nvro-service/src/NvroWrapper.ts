
import Axios from "axios";

const MARKET_LINK = "https://www.novaragnarok.com/data/cache/ajax/item_*.json";

export class NvroWrapper {
    static async getItemById(id: number) {
        const link = MARKET_LINK.replace("*", id.toString());
        try {
            const { data } = await Axios.get(link, {
                responseType: "json"
            });
            return data;
        }
        catch (err) {
            console.log(err);
        }
    }
}