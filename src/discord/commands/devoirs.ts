import { EmbedBuilder } from "discord.js";
import { extractProfile } from "../../ent/entApi";
import { EntHomework } from "../../ent/types";
import { formatDate, requireEntApi } from "../requireLink";
import { OpenEntSubcommand } from "./types";

const RANGE_DAYS = 14;
const MAX_ITEMS = 10;

export const devoirsCommand: OpenEntSubcommand = {
  name: "devoirs",
  build: (sub) => sub.setName("devoirs").setDescription("Mes devoirs des prochains jours"),
  async execute(interaction, ctx) {
    const api = await requireEntApi(interaction, ctx);
    if (!api) return;
    await interaction.deferReply({ ephemeral: true });

    const profile = extractProfile(await api.getUserInfo());
    const structureId = profile.structureIds[0];
    if (!structureId) {
      await interaction.editReply("Aucun établissement associé à votre compte Open ENT.");
      return;
    }

    const today = new Date();
    const end = new Date(today);
    end.setDate(end.getDate() + RANGE_DAYS);

    let homeworks: EntHomework[];
    try {
      homeworks = await api.getOwnHomeworks(structureId, formatDate(today), formatDate(end));
    } catch (err) {
      await interaction.editReply("Impossible de récupérer vos devoirs pour le moment (module cahier-de-textes indisponible).");
      throw err;
    }

    if (homeworks.length === 0) {
      await interaction.editReply("🎉 Aucun devoir dans les 14 prochains jours.");
      return;
    }

    const sorted = [...homeworks].sort((a, b) => String(a.due_date ?? "").localeCompare(String(b.due_date ?? "")));
    const embed = new EmbedBuilder()
      .setTitle("📝 Devoirs")
      .setColor(0x2f7ce0)
      .addFields(
        sorted.slice(0, MAX_ITEMS).map((hw) => ({
          name: hw.due_date ? `À rendre le ${hw.due_date}` : "Échéance non précisée",
          value: hw.description?.trim() || "(sans description)"
        }))
      );
    if (sorted.length > MAX_ITEMS) {
      embed.setFooter({ text: `+ ${sorted.length - MAX_ITEMS} autre(s) devoir(s)` });
    }

    await interaction.editReply({ embeds: [embed] });
  }
};
