import { Firebot } from "@crowbartools/firebot-custom-scripts-types";
import * as packageJson from "../package.json";
import { QuestMasterService } from "./quest-master";
import { effectManager, eventManager, initModules, variableManager } from "@oceanity/firebot-helpers/firebot";
import { AllQuestMasterVariables } from "./firebot/variables";
import { AllQuestMasterEffects } from "./firebot/effects";
import { Effects } from "@crowbartools/firebot-custom-scripts-types/types/effects";
import { QuestMasterEventSource } from "./firebot/events/quest-master-events";

export const { displayName: name, description, author, version } = packageJson;

export let questMaster: QuestMasterService;

interface Params {
  apiPath: string;
  apiKey: string;
}

const script: Firebot.CustomScript<Params> = {
  getScriptManifest: () => {
    return {
      name,
      description,
      author,
      version,
      firebotVersion: "5",
    };
  },
  getDefaultParameters: () => {
    return {
      apiKey: {
        type: "string",
        title: "API Key",
        default: "",
        description: "Get this at your Mod.io API Access page: https://mod.io/me/access",
        useTextArea: false,
      },
      apiPath: {
        type: "string",
        title: "API Path",
        description: "Also on API Access page, and looks like https://u-########.modapi.io/v1",
        default: ""
      },
    };
  },
  run: (runRequest) => {
    const { apiKey, apiPath } = runRequest.parameters;

    if (!apiKey) throw new Error("Missing API Key");
    if (!apiPath) throw new Error("Missing API Path");

    initModules(runRequest.modules);
    questMaster = new QuestMasterService(apiKey, apiPath);

    for (const variable of AllQuestMasterVariables) {
      variableManager.registerReplaceVariable(variable);
    }

    for (const effect of AllQuestMasterEffects) {
      effect.definition.id = `${name}:${effect.definition.id}`;

      effectManager.registerEffect(effect as Effects.EffectType<{ [key: string]: any }>);
    }

    // Register events
    QuestMasterEventSource.id = name;
    eventManager.registerEventSource(QuestMasterEventSource);
  },
};

export default script;
