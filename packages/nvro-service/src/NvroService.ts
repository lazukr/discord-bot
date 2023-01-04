import Express from "express";
import { ItemCache } from "./ItemCache.js";
import { ItemManager } from "./ItemManager.js";
import { ServiceLogger } from "./ServiceLogger.js";
import { cacheConfig } from "./configuration/Config.js";
import { ItemRequest } from "./dto/internal/ItemRequest.js";
import { NvroWrapper } from "./NvroWrapper.js";
export class NvroService {
    app: Express.Application;
    itemManager: ItemManager;
    itemCache: ItemCache;

    constructor() {
        this.app = Express();
        // app setup
        this.app.listen(3000, () => {
            ServiceLogger.log("server listening on 3000...");
        });
        this.app.use(Express.urlencoded({extended: false}));
        this.app.use(Express.json());

        this.itemCache = new ItemCache(cacheConfig, NvroWrapper.getItemById);
        ServiceLogger.log(`Created item cache with cache duraation of ${cacheConfig.cacheDuration} ms.`);
        this.itemManager = new ItemManager(this.itemCache);
        this.setupRoutes();
    }

    setupRoutes() {
        this.app.post("/getItemMarketById", async (request, response) => {
            try {
                ServiceLogger.log(`incoming requst with parameters: ${JSON.stringify(request.body)}`);
                const itemRequest = request.body as ItemRequest;
                const results = await this.itemManager.get(itemRequest);
                response.setHeader("Content-Type", "application/json");
                response.json(results);
            }
            catch (err) {
                ServiceLogger.warn(`getItemMarketById failed with the ${err}.`);
            }
        });
    }
}