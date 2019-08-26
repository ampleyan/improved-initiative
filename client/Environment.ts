import * as Sentry from "@sentry/browser";
import { StatBlock } from "../common/StatBlock";
import { ParseJSONOrDefault } from "../common/Toolbox";

interface Environment {
  EncounterId: string;
  PostedEncounter: { Combatants: {}[] } | null;
  IsLoggedIn: boolean;
  HasStorage: boolean;
  HasEpicInitiative: boolean;
  BaseUrl: string;
  PatreonLoginUrl: string;
}

export const env: Environment = {
  EncounterId: null,
  BaseUrl: null,
  PostedEncounter: null,
  PostedStatBlock: null,
  HasStorage: false,
  HasEpicInitiative: false,
  IsLoggedIn: false,
  PatreonLoginUrl: "http://www.patreon.com/"
};

export function LoadEnvironment() {
  const html = document.getElementsByTagName("html")[0];

  env.EncounterId = html.getAttribute("encounterId");
  env.BaseUrl = html.getAttribute("baseUrl");
  const encounterJSON = html.getAttribute("postedEncounter");
  if (encounterJSON) {
    env.PostedEncounter = ParseJSONOrDefault(encounterJSON, { Combatants: [] });
  }
  env.HasStorage = html.getAttribute("hasStorage") == "true";
  env.HasEpicInitiative = html.getAttribute("hasEpicInitiative") == "true";
  env.IsLoggedIn = html.getAttribute("isLoggedIn") == "true";
  env.PatreonLoginUrl = html.getAttribute("patreonLoginUrl");

  const sentryDsn = html.getAttribute("sentryDsn");
  if (sentryDsn !== null) {
    Sentry.init({
      dsn: sentryDsn,
      release: `improved-initiative@${process.env.VERSION}`
    });
  }
}
