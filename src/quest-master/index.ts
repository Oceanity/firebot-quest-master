import { QuestMasterApiService } from "./api";
import { QuestMasterDungeonsService } from "./dungeons";
import { QuestMasterQueueService } from "./queue";
import { QuestMasterUsersService } from "./users";

export class QuestMasterService {
    public readonly api: QuestMasterApiService;
    public readonly dungeons: QuestMasterDungeonsService;
    public readonly queue: QuestMasterQueueService;
    public readonly users: QuestMasterUsersService;

    constructor(apiKey: string, apiPath: string) {
        this.api = new QuestMasterApiService(apiKey, apiPath);
        this.dungeons = new QuestMasterDungeonsService(this);
        this.queue = new QuestMasterQueueService(this);
        this.users = new QuestMasterUsersService(this);
    }
}
