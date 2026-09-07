import { EmbedBuilder } from "discord.js";
import { extractProfile } from "../../ent/entApi";
import { requireEntApi } from "../requireLink";
import { OpenEntSubcommand } from "./types";

export const classesCommand: OpenEntSubcommand = {
  name: "classes",
  build: (sub) => sub.setName("classes").setDescription("Mes classes et groupes"),
  async execute(interaction, ctx) {
    const api = await requireEntApi(interaction, ctx);
    if (!api) return;
    await interaction.deferReply({ ephemeral: true });

    const profile = extractProfile(await api.getUserInfo());
    const embed = new EmbedBuilder()
      .setTitle(`📚 Classes et groupes de ${profile.displayName}`)
      .setColor(0x2f7ce0)
      .addFields(
        { name: "Structures", value: listOrDash(profile.structureNames) },
        { name: "Classes", value: listOrDash(profile.classNames) },
        { name: "Groupes", value: listOrDash(profile.groupNames) }
      );

    await interaction.editReply({ embeds: [embed] });
  }
};

function listOrDash(items: string[]): string {
  return items.length > 0 ? items.map((i) => `• ${i}`).join("\n") : "—";
}
