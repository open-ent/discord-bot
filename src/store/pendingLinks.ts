import crypto from "node:crypto";

interface PendingLink {
  discordUserId: string;
  createdAt: number;
}

const TTL_MS = 10 * 60 * 1000;

/**
 * Associe temporairement un `state` OAuth2 opaque au Discord user qui a lancé
 * `/openent link`, le temps que le navigateur fasse l'aller-retour vers Open ENT.
 * En mémoire uniquement : un redémarrage du bot invalide les liens en cours (l'utilisateur relance la commande).
 */
export class PendingLinks {
  private readonly byState = new Map<string, PendingLink>();

  constructor() {
    setInterval(() => this.evictExpired(), 60 * 1000).unref();
  }

  create(discordUserId: string): string {
    const state = crypto.randomBytes(24).toString("hex");
    this.byState.set(state, { discordUserId, createdAt: Date.now() });
    return state;
  }

  /** Consomme (usage unique) le state ; renvoie `undefined` s'il est inconnu ou expiré. */
  consume(state: string): string | undefined {
    const entry = this.byState.get(state);
    this.byState.delete(state);
    if (!entry) return undefined;
    if (Date.now() - entry.createdAt > TTL_MS) return undefined;
    return entry.discordUserId;
  }

  private evictExpired(): void {
    const now = Date.now();
    for (const [state, entry] of this.byState) {
      if (now - entry.createdAt > TTL_MS) this.byState.delete(state);
    }
  }
}
