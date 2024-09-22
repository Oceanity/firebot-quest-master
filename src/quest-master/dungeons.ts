import { logger } from "@oceanity/firebot-helpers/firebot";
import { getErrorMessage, formatMsToTimecode } from "@oceanity/firebot-helpers/string";
import { QuestMasterService } from ".";
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";

export class QuestMasterDungeonsService {
    private readonly questMaster: QuestMasterService;
    private readonly _cachedDungeons: Record<string, QuestMasterDungeon> = {};
    
    constructor(questMasterService: QuestMasterService) {
        this.questMaster = questMasterService;
    }

    public async existsAsync(dungeonId: number) {
        try {
            const dungeon = await this.getById(dungeonId);

            return !!dungeon;
        } catch (error) {
            logger.error(getErrorMessage(error));
            return error;
        }
    }
    
    public async getById(dungeonId: number): Promise<QuestMasterDungeon | undefined> {
        try {
            if (isNaN(dungeonId)) throw new Error("Invalid dungeonId");

            if (this._cachedDungeons[dungeonId]) return this._cachedDungeons[dungeonId];

            const mod = await this.questMaster.api.get<ModIOMod>(`mods/${dungeonId}`);
            if (!mod) throw new Error("Failed to get mod");

            const details = await this.getDetailsByIdAsync(dungeonId);
            if (!details) throw new Error("Failed to get dungeon details");

            const dungeon = this.dungeonFromMod(mod, details);

            logger.info(JSON.stringify(dungeon));
            
            this._cachedDungeons[dungeonId] = dungeon;

            return dungeon;
        } catch (error) {
            logger.error(getErrorMessage(error));
            return undefined;
        }
    }

    public async searchAsync(query: string): Promise<Array<QuestMasterDungeon>> {
        try {
            const formattedQuery = this.searchParamsFromQuery(query);

            const mods = await this.questMaster.api.get<ModIOSearchResult<ModIOMod>>(`mods`, formattedQuery);
            if (!mods) throw new Error("Failed to get mods");

            return mods.data.map(mod => this.dungeonFromMod(mod));
        } catch (error) {
            logger.error(getErrorMessage(error));
            return [];
        }
    }

    private async getDetailsByIdAsync(dungeonId: number): Promise<QuestMasterDungeonDetails | undefined> {
        try {
            const dungeonComments = await this.questMaster.api.get<ModIOSearchResult<ModIOComment>>(`mods/${dungeonId}/comments`);
            if (!dungeonComments) return undefined;

            logger.info(`Quest Master: Fetched ${dungeonComments.data.length} comments for dungeon ${dungeonId}`);

            const [latest] = dungeonComments.data;
            const content = latest.content as string;
            const [
                attempts,
                completions,
                failures,
                worldRecordDurationInMilliseconds,
                worldRecordUserId,
                completionTimeCount,
                completionTimeAverageInMilliseconds
            ] = content.split("|").map(v => Number(v));
            
            const dungeonDetails: QuestMasterDungeonDetails = {
                attempts,
                completions,
                failures,
                worldRecordDurationInMilliseconds,
                worldRecordUserId,
                completionTimeCount,
                completionTimeAverageInMilliseconds
            };

            logger.info(JSON.stringify(dungeonDetails));

            return dungeonDetails;
        } catch (error) {
            logger.error(getErrorMessage(error));
            return undefined;
        }
    }

    public getFromTrigger(trigger?: Effects.Trigger): QuestMasterDungeon | undefined {
        try {
            if (!trigger) return undefined;

            // Check route metadata
            if (trigger.metadata?.eventData?.dungeon) return trigger.metadata.eventData.dungeon as QuestMasterDungeon;

            // Return current from queue
            return this.questMaster.queue.current;
        } catch (error) {
            logger.error(getErrorMessage(error));
            return undefined;
        }
    }

    private dungeonFromMod (mod: ModIOMod, details?: QuestMasterDungeonDetails): QuestMasterDungeon {
        return ({
            id: `${mod.id}`,
            name: mod.name,
            description: mod.description,
            uploader: {
                id: mod.submitted_by.id,
                username: mod.submitted_by.name_id,
                displayName: mod.submitted_by.username,
                avatarUrl: mod.submitted_by.avatar.original
            },
            tags: mod.tags.map(t => t.name),
            localizedTags: mod.tags.map(t => t.name_localized),
            likes: mod.stats.ratings_positive,
            attempts: details?.attempts ?? 0,
            completions: details?.completions ?? 0,
            completionRate: +(details ? details.completions / details.attempts * 100 : 0).toFixed(2),
            failures: details?.failures ?? 0,
            failureRate: +(details ? details.failures / details.attempts * 100 : 0).toFixed(2),
            worldRecordTime: details ? formatMsToTimecode(details.worldRecordDurationInMilliseconds) : "N/A",
            worldRecordTimeMs: details?.worldRecordDurationInMilliseconds ?? -1,
        })
    }

    private searchParamsFromQuery(query: string = "", limit: number = 5) {
        const specialTags = { tag: "tags", creator: "submitted_by_display_name" }
        const specialTagRegex = new RegExp(`^(?:-?)(${Object.keys(specialTags).join("|")}):(.+)$`);

        const params: Record<string, Array<string>> = {
            _q: [],
        };
        Object.values(specialTags).forEach(k => {
            params[k] = [];
            params[`${k}-not`] = [];
        });

        // Build param arrays
        query
            .split(" ")
            .forEach(s => {
                if (!s.trim()) return;

                const match = s.match(specialTagRegex);
                if (match) {
                    const [tag, value] = match.slice(1);

                    const negate = s.startsWith("-");
                    const key = `${specialTags[tag as keyof typeof specialTags]}${negate ? "-not" : ""}`;

                    params[key].push(value);
                    return;
                }

                params["_q"].push(s);
            });

        // Organize to mod.io search query
        const output: Record<string, string> = {};
        Object.entries(params).forEach(([k, v]) => {
            if (!v.length) return;

            if (k === "_q") {
                output[k] = v.join(" ");
                return;
            }

            output[v.length === 1 ? k : `${k}-in`] = v.map(v => v.replace(/_/g, " ")).join(",");
        });

        // Add specialized fields
        output["_limit"] = limit.toString();

        return output;
    }
}