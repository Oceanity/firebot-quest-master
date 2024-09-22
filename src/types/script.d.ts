type QuestMasterApiBaseOptions = {
    api_key: string
}

type QuestMasterApiUserOptions = {
    [key: string]: any
}

type QuestMasterApiOptions =
    & QuestMasterApiBaseOptions
    & QuestMasterApiUserOptions