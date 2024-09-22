import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { EffectTrigger } from "@/shared/constants";
import { questMaster } from "@/main";
import { objectWalkPath } from "@oceanity/firebot-helpers/object";
import { logger } from "@oceanity/firebot-helpers/firebot";

const triggers: Record<string, boolean> = {};
triggers[EffectTrigger.COMMAND] = true;
triggers[EffectTrigger.EVENT] = true;
triggers[EffectTrigger.MANUAL] = true;
triggers[EffectTrigger.CUSTOM_SCRIPT] = true;

export const questMasterDungeonVariable: ReplaceVariable = {
  definition: {
    handle: "questMasterDungeon",
    description:
      "Returns an object containing details of the dungeon from the current event.",
    usage: "questMasterDungeon",
    triggers,
    possibleDataOutput: ["text"],
    examples: [
        {
            usage: "questMasterDungeon[dungeonId]",
            description: "Returns an object containing details of the specified dungeon"
        },
        {
            usage: "questMasterDungeon[dungeonId, name]",
            description: "Returns the name of the specified dungeon"
        },
        {
            usage: "questMasterDungeon[dungeonId, uploaderDisplayName]",
            description: "Returns the display name of the uploader of the specified dungeon"
        }
    ]
  },
  evaluator: async (trigger, dungeonId?: string, key?: string) => {
    logger.info(`Event Data: \n${JSON.stringify(trigger?.metadata?.eventData)}`);
    // If user is only supplying a key and not an id, swap variables
    if (!key && (dungeonId && !/\d+/.test(dungeonId))) {
      key = dungeonId;
      dungeonId = undefined;
    }

    const dungeon: QuestMasterDungeon | undefined = dungeonId
      ? (await questMaster.dungeons.getById(Number(dungeonId)))
      : questMaster.dungeons.getFromTrigger(trigger);
 
    if (!dungeon) return "[Unknown Dungeon]";

    return objectWalkPath(dungeon, key);
  },
};