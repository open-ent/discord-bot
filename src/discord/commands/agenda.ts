import { EmbedBuilder } from "discord.js";
import { extractProfile } from "../../ent/entApi";
import { EntCourse } from "../../ent/types";
import { formatDate, requireEntApi } from "../requireLink";
import { OpenEntSubcommand } from "./types";

export const agendaCommand: OpenEntSubcommand = {
  name: "agenda",
  build: (sub) => sub.setName("agenda").setDescription("Mon emploi du temps du jour"),
  async execute(interaction, ctx) {
    const api = await requireEntApi(interaction, ctx);
    if (!api) return;
    await interaction.deferReply({ ephemeral: true });

    const profile = extractProfile(await api.getUserInfo());
    const structureId = profile.structureIds[0];
    if (!structureId || profile.classNames.length === 0) {
      await interaction.editReply("Aucun établissement/classe associé à votre compte Open ENT.");
      return;
    }

    const today = formatDate(new Date());
    let courses: EntCourse[];
    try {
      courses = await api.getCourses(structureId, today, today, profile.classNames);
    } catch (err) {
      await interaction.editReply("Le service d'emploi du temps (module edt) n'a pas répondu.");
      throw err;
    }

    if (courses.length === 0) {
      await interaction.editReply("📅 Aucun cours trouvé aujourd'hui.");
      return;
    }

    const sorted = [...courses].sort((a, b) => String(a.startDate ?? "").localeCompare(String(b.startDate ?? "")));
    const embed = new EmbedBuilder()
      .setTitle("📅 Aujourd'hui")
      .setColor(0x2f7ce0)
      .setDescription(
        sorted
          .map((course) => {
            const room = course.roomLabels?.[0] ? ` (${course.roomLabels[0]})` : "";
            return `**${course.startDate ?? "?"} – ${course.endDate ?? "?"}**${room}`;
          })
          .join("\n")
      );

    await interaction.editReply({ embeds: [embed] });
  }
};
