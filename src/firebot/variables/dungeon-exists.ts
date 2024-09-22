import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { questMaster } from "@/main";
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";

export const questMasterDungeonExistsVariable: ReplaceVariable = {
  definition: {
    handle: "questMasterDungeonExists",
    description:
      "Returns `$true` if the specified Quest Master dungeon exists. Otherwise, returns `$false`.",
    usage: "questMasterDungeonExists[dungeonId]",
    possibleDataOutput: ["text"],
  },
  evaluator: async (trigger: Effects.Trigger, dungeonId?: number) => {
    if (!dungeonId) {
      const dungeon = questMaster.dungeons.getFromTrigger(trigger);

      return !!dungeon;
    }

    return await questMaster.dungeons.existsAsync(dungeonId);
  },
};