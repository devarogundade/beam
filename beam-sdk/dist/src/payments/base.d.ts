import { HexString } from "../types";
export declare abstract class BasePayment {
    private currentTab;
    protected readonly basePath: string;
    constructor();
    protected createSession(): string;
    protected buildUrl(baseUrl: string, params: Record<string, HexString | string | number | boolean | undefined>): string;
    protected launchTabAndAwaitResult(url: string, { data, target }: {
        data: any;
        target: string;
    }, callback: (data: any) => void): Promise<void>;
    private messageHandler;
}
