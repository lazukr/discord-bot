import Express from "express";
export class NvroService {
    app: Express.Application;
    constructor() {
        this.app = Express();
        this.app.listen(3000, () => {
            console.log("server listening on 3000...");
        });
        this.app.use(Express.json());
        
    }
}