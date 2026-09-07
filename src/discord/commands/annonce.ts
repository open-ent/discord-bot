import { requireEntApi } from "../requireLink";
import { OpenEntSubcommand } from "./types";

export const annonceCommand: OpenEntSubcommand = {
  name: "annonce",
  build: (sub) =>
    sub
      .setName("annonce")
      .setDescription("Publier une annonce dans une classe (message Open ENT)")
      .addStringOption((opt) => opt.setName("classe").setDescription("Nom de la classe ou du groupe").setRequired(true))
      .addStringOption((opt) => opt.setName("message").setDescription("Contenu de l'annonce").setRequired(true)),
  async execute(interaction, ctx) {
    const api = await requireEntApi(interaction, ctx);
    if (!api) return;
    await interaction.deferReply({ ephemeral: true });

    const classe = interaction.options.getString("classe", true);
    const message = interaction.options.getString("message", true);

    const group = await api.findGroupByName(classe);
    if (!group) {
      await interaction.editReply(`Aucune classe/groupe visible correspondant à « ${classe} ».`);
      return;
    }

    await api.sendMessage({
      to: [group.id],
      subject: `📢 Annonce — ${group.groupDisplayName ?? group.name ?? classe}`,
      body: message
    });

    await interaction.editReply(`✅ Annonce envoyée à **${group.groupDisplayName ?? group.name ?? classe}**.`);
  }
};
