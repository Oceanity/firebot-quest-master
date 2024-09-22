type QuestMasterDungeon = {
    id: string;
    name: string;
    description: string;
    uploader: QuestMasterUser;
    tags: Array<string>;
    localizedTags: Array<string>;
    likes: number;
    attempts: number;
    completions: number;
    completionRate: number;
    failures: number;
    failureRate: number;
    worldRecordHolder?: QuestMasterUser;
    worldRecordTime?: string;
    worldRecordTimeMs?: number;
    completionTimeCount?: number;
    completionTimeAverageInMilliseconds?: number;
    queuedBy?: string;
    queuePosition?: number;
}

type QuestMasterDungeonDetails = {
    attempts: number;
    completions: number;
    failures: number;
    worldRecordDurationInMilliseconds: number;
    worldRecordUserId: number;
    completionTimeCount: number;
    completionTimeAverageInMilliseconds: number;
}

type QuestMasterUser = {
    id: number;
    username: string;
    displayName: string;
    avatarUrl: string;
}