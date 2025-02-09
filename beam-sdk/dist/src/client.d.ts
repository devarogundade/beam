import { BeamSDKOptions } from "./types";
export declare class BeamClient {
    private client;
    constructor(options: BeamSDKOptions);
    request<T>(method: string, url: string, data?: any): Promise<T>;
}
