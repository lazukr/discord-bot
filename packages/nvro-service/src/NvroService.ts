import Express from "express";
import { ServiceLogger } from "./ServiceLogger.js";
export class NvroService {
    app: Express.Application;
    constructor() {
        this.app = Express();
        this.app.listen(3000, () => {
            ServiceLogger.log("server listening on 3000...");
        });
        this.app.use(Express.json());
        
    }
}