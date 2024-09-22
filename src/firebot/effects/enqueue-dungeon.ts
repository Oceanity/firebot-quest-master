import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { getErrorMessage } from "@oceanity/firebot-helpers/string";
import { logger } from "@oceanity/firebot-helpers/firebot";
import { questMaster } from "@/main";

type EnqueueDungeonEffectParams = { queuedBy?: string, dungeonId: number };

export const QuestMasterEnqueueDungeonEffect: Firebot.EffectType<EnqueueDungeonEffectParams> = {
  definition: {
    id: "enqueue-dungeon",
    name: "Quest Master: Add Dungeon to Queue",
    description:
      "Adds dungeon to the queue via dungeon Id",
    icon: "fad fa-swords",
    categories: ["integrations"],
    //@ts-expect-error ts2353
    outputs: [
      {
        label: "Enqueued Dungeon",
        description:
          "Will be the enqueued dungeons, or null if not found.",
        defaultName: "enqueuedDungeon",
      },
    ],
  },

  optionsTemplate: `
      <eos-container header="Queued by" pad-top="true">
        <firebot-input
          model="effect.queuedBy"
          placeholder-text="username"
          menu-position="under" />
      </eos-container>
      <eos-container header="Dungeon ID" pad-top="true">
        <firebot-input
          model="effect.dungeonId"
          placeholder-text="Dungeon ID"
          menu-position="under" />
      </eos-container>
    `,
  
  // @ts-expect-error ts6133: Variables must be named consistently
  optionsController: ($scope: EffectScope<EnqueueDungeonEffectParams>) => {},

  optionsValidator: () => {
    return [];
  },

  onTriggerEvent: async (event) => {
    try {
      const { queuedBy, dungeonId } = event.effect;

      const dungeon = await questMaster.queue.pushDungeon(dungeonId, queuedBy);

      return {
        success: true,
        outputs: {
            enqueuedDungeon: dungeon,
        },
      };
    } catch (error) {
      logger.error(getErrorMessage(error));
      return {
        success: false,
        outputs: {
          enqueuedDungeon: null,
        },
      };
    }
  },
};