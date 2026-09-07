import { requireEntApi } from "../requireLink";
import { OpenEntSubcommand } from "./types";

export const partagerCommand: OpenEntSubcommand = {
  name: "partager",
  build: (sub) =>
    sub
      .setName("partager")
      .setDescription("Partager un lien avec une classe ou un groupe")
      .addStringOption((opt) => opt.setName("classe").setDescription("Nom de la classe ou du groupe").setRequired(true))
      .addStringOption((opt) => opt.setName("titre").setDescription("Titre de la ressource").setRequired(true))
      .addStringOption((opt) => opt.setName("lien").setDescription("URL de la ressource").setRequired(true))
      .addStringOption((opt) => opt.setName("commentaire").setDescription("Commentaire").setRequired(false)),
  async execute(interaction, ctx) {
    const api = await requireEntApi(interaction, ctx);
    if (!api) return;
    await interaction.deferReply({ ephemeral: true });

    const classe = interaction.options.getString("classe", true);
    const titre = interaction.options.getString("titre", true);
    const lien = interaction.options.getString("lien", true);
    const commentaire = interaction.options.getString("commentaire");

    const group = await api.findGroupByName(classe);
    if (!group) {
      await interaction.editReply(`Aucune classe/groupe visible correspondant à « ${classe} ».`);
      return;
    }

    const body = [titre, lien, commentaire].filter(Boolean).join("\n\n");
    await api.sendMessage({
      to: [group.id],
      subject: `📎 Ressource partagée — ${titre}`,
      body
    });

    await interaction.editReply(`✅ « ${titre} » partagé avec **${group.groupDisplayName ?? group.name ?? classe}**.`);
  }
};
