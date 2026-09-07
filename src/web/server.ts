import express, { Express } from "express";
import { AppContext } from "../context";
import { logger } from "../logger";

function page(title: string, body: string): string {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;text-align:center;color:#1f2933}</style>
</head><body><h1>${title}</h1><p>${body}</p></body></html>`;
}

export function createWebServer(ctx: AppContext): Express {
  const app = express();

  app.get("/healthz", (_req, res) => {
    res.status(200).send("ok");
  });

  app.get("/oauth/callback", async (req, res) => {
    const { code, state, error } = req.query;

    if (typeof state !== "string") {
      res.status(400).send(page("Lien invalide", "Paramètre state manquant."));
      return;
    }
    const discordUserId = ctx.pendingLinks.consume(state);
    if (!discordUserId) {
      res
        .status(400)
        .send(page("Lien expiré", "Ce lien n'est plus valide. Relancez <code>/openent link</code> dans Discord."));
      return;
    }
    if (typeof error === "string") {
      res.status(400).send(page("Connexion refusée", "L'autorisation Open ENT a été annulée ou refusée."));
      return;
    }
    if (typeof code !== "string") {
      res.status(400).send(page("Lien invalide", "Paramètre code manquant."));
      return;
    }

    try {
      const token = await ctx.oauth.exchangeCode(code);
      await ctx.linkStore.save(discordUserId, {
        entHost: ctx.config.entHost,
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        tokenType: token.token_type,
        expiresAt: Date.now() + token.expires_in * 1000,
        scope: token.scope
      });
      res.status(200).send(page("Compte lié ✅", "Vous pouvez revenir sur Discord et utiliser les commandes /openent."));
    } catch (err) {
      logger.error("Échange OAuth2 échoué", err);
      res.status(502).send(page("Erreur", "La connexion à Open ENT a échoué. Réessayez plus tard."));
    }
  });

  return app;
}
