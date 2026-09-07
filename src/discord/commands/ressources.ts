import { EmbedBuilder } from "discord.js";
import { requireEntApi } from "../requireLink";
import { OpenEntSubcommand } from "./types";

const MAX_ITEMS = 10;

export const ressourcesCommand: OpenEntSubcommand = {
  name: "ressources",
  build: (sub) => sub.setName("ressources").setDescription("Mes ressources récentes (espace documentaire)"),
  async execute(interaction, ctx) {
    const api = await requireEntApi(interaction, ctx);
    if (!api) return;
    await interaction.deferReply({ ephemeral: true });

    const documents = await api.getDocuments();
    if (documents.length === 0) {
      await interaction.editReply("Aucune ressource trouvée dans votre espace documentaire.");
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("📚 Mes ressources")
      .setColor(0x2f7ce0)
      .setDescription(
        documents
          .slice(0, MAX_ITEMS)
          .map((doc) => `• ${doc.name ?? doc.metadata?.filename ?? "(sans nom)"}`)
          .join("\n")
      );

    await interaction.editReply({ embeds: [embed] });
  }
};
