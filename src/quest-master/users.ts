import { logger } from "@oceanity/firebot-helpers/firebot";
import { getErrorMessage, formatMsToTimecode } from "@oceanity/firebot-helpers/string";
import { QuestMasterService } from ".";

export class QuestMasterUsersService {
    private readonly _questMaster: QuestMasterService;
    
    private _cachedUsers: Record<string, QuestMasterUser> = {};
    
    constructor(questMasterService: QuestMasterService) {
        this._questMaster = questMasterService;
    }

    public async existsAsync(userId: number): Promise<boolean> {
        try {
            const user = this.getById(userId);

            return !!user;
        } catch (error) {
            logger.error(getErrorMessage(error));
            return false;
        }
    }
    
    public storeUserArray (users: Array<QuestMasterUser>) {
        this._cachedUsers = users.reduce((uniqueUsers, user) => {
            if (!uniqueUsers[user.id]) {
                uniqueUsers[user.id] = user;
            }
            return uniqueUsers;
        }, {} as Record<number, QuestMasterUser>);
    }
    
    public getById = (userId?: number): QuestMasterUser | undefined =>
        userId && this._cachedUsers[userId]
            ? this._cachedUsers[userId]
            : undefined;
}