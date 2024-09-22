import { eventManager, logger } from "@oceanity/firebot-helpers/firebot";
import { QuestMasterService } from ".";
import { getErrorMessage } from "@oceanity/firebot-helpers/string";
import { name as namespace } from "@/main";

export class QuestMasterQueueService {
    public readonly questMaster: QuestMasterService;

    private _queue: Array<QuestMasterDungeon> = [];
    private _isReady: boolean = false;
    private _current: QuestMasterDungeon | undefined;

    constructor(questMasterService: QuestMasterService) {
        this.questMaster = questMasterService;
    }

    public get current() {
        return this._current;
    }

    public get = () => 
        this._queue
            .map((entry, i) => ({
                ...entry,
                index: i + 1 
            }));

    public getQueuesByUser = (username: string) =>
        this.get()
            .filter(entry => entry.queuedBy === username);

    public async pushDungeon(dungeonId: number, username?: string) {
        try {
            const dungeon = await this.questMaster.dungeons.getById(dungeonId);

            if (!dungeon) throw new Error("Failed to find Dungeon with that Id");

            this._queue.push({ ...dungeon, queuedBy: username });

            return dungeon;
        } catch (ex) {
            logger.error(getErrorMessage(ex));
            throw ex;    
        }
    }

    public async pullDungeon(): Promise<QuestMasterDungeon | undefined> {
        try {
            const lastDungeon = this._current;

            this._current = this._queue.length
                ? this._queue.shift()
                : undefined;

            if (lastDungeon !== this._current) {
                eventManager.triggerEvent(namespace, "dungeon-changed", { dungeon: this._current });
            }

            return this._current;
        } catch (ex) {
            logger.error(getErrorMessage(ex));
            throw ex;
        }
    }

    public async initialize() {
        if (this._isReady) return;

        this._isReady = true;
    }
}