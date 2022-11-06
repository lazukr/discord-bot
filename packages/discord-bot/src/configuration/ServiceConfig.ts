import Config from "config";

export interface ServiceConfig {
    url: string;
};

export const serviceConfig: ServiceConfig = {
    url: Config.get("serviceUrl"),
};