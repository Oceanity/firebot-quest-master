import { ReplaceVariable } from "@crowbartools/firebot-custom-scripts-types/types/modules/replace-variable-manager";
import { EffectTrigger } from "@/shared/constants";
import { questMaster } from "@/main";
import { objectWalkPath } from "@oceanity/firebot-helpers/object";

const triggers: Record<string, boolean> = {};
triggers[EffectTrigger.COMMAND] = true;
triggers[EffectTrigger.EVENT] = true;
triggers[EffectTrigger.MANUAL] = true;
triggers[EffectTrigger.CUSTOM_SCRIPT] = true;

export const QuestMasterQueueVariable: ReplaceVariable = {
  definition: {
    handle: "questMasterQueue",
    description:
      "Returns an array of dungeons that have been enqueued.",
    usage: "questMasterQueue",
    triggers,
    possibleDataOutput: ["text"],
    examples: [
        {
            usage: "questMasterQueue[username]",
            description: "Returns an array of dungeon that have been enqueued by specified user."
        },
        {
            usage: "questMasterQueue[username, key]",
            description: "Returns the value of the specified key in the array of dungeon that have been enqueued by specified user."
        }
    ]
  },
  evaluator: async (_trigger, username?: string, key?: string) => {
    return objectWalkPath(
        username
            ? questMaster.queue.getQueuesByUser(username)
            : questMaster.queue.get()
        , key);
  },
};