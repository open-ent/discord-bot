import { Config } from "./config";
import { EntApi } from "./ent/entApi";
import { EntOAuthClient } from "./ent/oauth";
import { LinkStore } from "./store/linkStore";
import { PendingLinks } from "./store/pendingLinks";
import { logger } from "./logger";

/** Marge avant expiration à partir de laquelle on rafraîchit le token proactivement. */
const REFRESH_MARGIN_MS = 60 * 1000;

export interface AppContext {
  config: Config;
  linkStore: LinkStore;
  pendingLinks: PendingLinks;
  oauth: EntOAuthClient;
  /** Renvoie un client API prêt à l'emploi pour ce Discord user, ou `undefined` s'il n'a pas lié son compte. */
  getEntApiFor(discordUserId: string): Promise<EntApi | undefined>;
}

export function createAppContext(config: Config): AppContext {
  const linkStore = new LinkStore(config);
  const pendingLinks = new PendingLinks();
  const oauth = new EntOAuthClient(config);

  async function getEntApiFor(discordUserId: string): Promise<EntApi | undefined> {
    const account = await linkStore.get(discordUserId);
    if (!account) return undefined;

    if (Date.now() < account.expiresAt - REFRESH_MARGIN_MS) {
      return new EntApi(account.entHost, account.accessToken);
    }
    if (!account.refreshToken) {
      // Token expiré et pas de refresh possible : on force un nouveau /openent link.
      await linkStore.delete(discordUserId);
      return undefined;
    }
    try {
      const refreshed = await oauth.refresh(account.refreshToken);
      const updated = {
        entHost: account.entHost,
        accessToken: refreshed.access_token,
        refreshToken: refreshed.refresh_token ?? account.refreshToken,
        tokenType: refreshed.token_type,
        expiresAt: Date.now() + refreshed.expires_in * 1000,
        scope: refreshed.scope ?? account.scope
      };
      await linkStore.save(discordUserId, updated);
      return new EntApi(updated.entHost, updated.accessToken);
    } catch (err) {
      logger.warn(`Échec du rafraîchissement du token pour ${discordUserId}`, err);
      await linkStore.delete(discordUserId);
      return undefined;
    }
  }

  return { config, linkStore, pendingLinks, oauth, getEntApiFor };
}
