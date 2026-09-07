import { loadConfig } from "./config";
import { createAppContext } from "./context";
import { createDiscordClient } from "./discord/client";
import { logger } from "./logger";
import { createWebServer } from "./web/server";

async function main(): Promise<void> {
  const config = loadConfig();
  const ctx = createAppContext(config);

  const app = createWebServer(ctx);
  const httpServer = app.listen(config.port, () => {
    logger.info(`Serveur de callback OAuth2 en écoute sur le port ${config.port}`);
  });

  const client = createDiscordClient(ctx);
  await client.login(config.discordToken);

  const shutdown = (signal: string) => {
    logger.info(`Signal ${signal} reçu, arrêt en cours...`);
    httpServer.close();
    client.destroy();
    process.exit(0);
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  logger.error("Échec du démarrage du bot", err);
  process.exit(1);
});
