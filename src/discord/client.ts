import { Client, Events, GatewayIntentBits } from "discord.js";
import { AppContext } from "../context";
import { logger } from "../logger";
import { subcommandsByName } from "./commands";

export function createDiscordClient(ctx: AppContext): Client {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once(Events.ClientReady, (readyClient) => {
    logger.info(`Bot Discord connecté en tant que ${readyClient.user.tag}`);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand() || interaction.commandName !== "openent") return;

    const handler = subcommandsByName.get(interaction.options.getSubcommand());
    if (!handler) {
      await interaction.reply({ content: "Commande inconnue.", ephemeral: true });
      return;
    }

    try {
      await handler.execute(interaction, ctx);
    } catch (err) {
      logger.error(`Erreur lors de l'exécution de /openent ${handler.name}`, err);
      const content = "Une erreur est survenue côté Open ENT. Réessayez plus tard.";
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(content).catch(() => undefined);
      } else {
        await interaction.reply({ content, ephemeral: true }).catch(() => undefined);
      }
    }
  });

  return client;
}
