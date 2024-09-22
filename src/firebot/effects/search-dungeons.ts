import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import { getErrorMessage } from "@oceanity/firebot-helpers/string";
import { logger } from "@oceanity/firebot-helpers/firebot";
import { questMaster } from "@/main";

type EffectParams = { query: string; };

export const QuestMasterSearchDungeonsEffect: Firebot.EffectType<EffectParams> = {
  definition: {
    id: "search-dungeons",
    name: "Quest Master: Search Dungeons",
    description:
      "Finds dungeons with names matching a query",
    icon: "fad fa-swords",
    categories: ["integrations"],
    //@ts-expect-error ts2353
    outputs: [
      {
        label: "Found Dungeons",
        description:
          "Will be an array of found dungeons, or empty array if nothing found.",
        defaultName: "foundDungeons",
      },
    ],
  },

  optionsTemplate: `
      <eos-container header="Search" pad-top="true">
        <firebot-input
          input=title="Search"
          model="effect.query"
          placeholder-text="Search query..."
          menu-position="under" />
      </eos-container>
    `,

  // @ts-expect-error ts6133: Variables must be named consistently
  optionsController: ($scope: EffectScope<EffectParams>) => {},

  optionsValidator: () => {
    return [];
  },

  onTriggerEvent: async (event) => {
    try {
      const { query } = event.effect;
      const tags = [];

      query.split(" ").forEach((q) => {
        if (q.startsWith("tag:")) {
          tags.push(q.replace("tag:", ""));
        }
      })

      const dungeons = await questMaster.dungeons.searchAsync(query);

      return {
        success: true,
        outputs: {
            foundDungeons: dungeons,
        },
      };
    } catch (error) {
        logger.error(getErrorMessage(error));
      return {
        success: false,
        outputs: {
          foundDungeons: [],
        },
      };
    }
  },
};