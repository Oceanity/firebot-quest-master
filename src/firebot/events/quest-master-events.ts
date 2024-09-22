export const QuestMasterEventSource = {
    id: "oceanity-quest-master",
    name: "Quest Master (by Oceanity)",
    description: "Events related to Oceanity's Quest Master integration",
    events: [
      {
        id: "dungeon-changed",
        name: "Dungeon Changed",
        description: "Current dungeon from queue changed",
        cached: false
      },
    ]
}