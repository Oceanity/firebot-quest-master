import { logger } from "@oceanity/firebot-helpers/firebot";
import { getErrorMessage } from "@oceanity/firebot-helpers/string";

export class QuestMasterApiService {
    private readonly QUEST_MASTER_ID: number = 4246;

    private readonly _apiKey: string;
    private readonly _apiPath: string;

    constructor(apiKey: string, apiPath: string) {
        this._apiKey = apiKey.trim();
        this._apiPath = apiPath.trim();
    }

    public async get<T>(endpoint: string, options?: Record<string, any>): Promise<T | undefined> {
        logger.info(`Quest Master: Making API call to ${endpoint} with body ${JSON.stringify(options) ?? "{}"}`);
        try {
            const url = this.getCallUrl(endpoint, "GET", options);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json();

            return data as T;
        } catch (error) {
            logger.error(getErrorMessage(error));
            throw error;
        }
    }

    private getCallUrl(endpoint: string, method: HttpMethod, params?: Record<string, any>): string {
        let url = `${this._apiPath}/games/${this.QUEST_MASTER_ID}/${endpoint}`;

        if (method !== "GET") return url;
        
        // If GET, add api_key to endpoint;
        const searchParams = new URLSearchParams({
            api_key: this._apiKey,
            ...(params ?? {})
        });
        return `${url}?${searchParams}`.replace(/\s/ig, "%20");
    }
}