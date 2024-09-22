import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { getErrorMessage } from "@oceanity/firebot-helpers/string";
import { logger } from "@oceanity/firebot-helpers/firebot";
import { questMaster } from "@/main";

type EnqueueDungeonEffectParams = { };

export const QuestMasterDequeueDungeonEffect: Firebot.EffectType<EnqueueDungeonEffectParams> = {
  definition: {
    id: "dequeue-dungeon",
    name: "Quest Master: Get Next Dungeon",
    description:
      "Pulls the next dungeon from the queue if one exists",
    icon: "fad fa-swords",
    categories: ["integrations"],
    //@ts-expect-error ts2353
    outputs: [
      {
        label: "Pulled Dungeon",
        description:
          "Will be the pulled dungeon, or null if queue is empty.",
        defaultName: "pulledDungeon",
      },
    ],
  },

  optionsTemplate: ``,
  
  // @ts-expect-error ts6133: Variables must be named consistently
  optionsController: ($scope: EffectScope<EnqueueDungeonEffectParams>) => {},

  optionsValidator: () => {
    return [];
  },

  onTriggerEvent: async () => {
    try {
      const dungeon = await questMaster.queue.pullDungeon();
      
      return {
        success: true,
        outputs: {
            pulledDungeon: dungeon,
        },
      };
    } catch (error) {
      logger.error(getErrorMessage(error));
      return {
        success: false,
        outputs: {
          pulledDungeon: null,
        },
      };
    }
  },
};