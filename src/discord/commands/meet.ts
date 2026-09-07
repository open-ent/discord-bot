import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { extractProfile } from "../../ent/entApi";
import { requireEntApi } from "../requireLink";
import { OpenEntSubcommand } from "./types";

export const meetCommand: OpenEntSubcommand = {
  name: "meet",
  build: (sub) =>
    sub
      .setName("meet")
      .setDescription("Rejoindre une visioconférence")
      .addStringOption((opt) => opt.setName("classe").setDescription("Classe/groupe (par défaut : votre première classe)").setRequired(false)),
  async execute(interaction, ctx) {
    const api = await requireEntApi(interaction, ctx);
    if (!api) return;
    await interaction.deferReply({ ephemeral: true });

    let room: string | undefined = interaction.options.getString("classe") ?? undefined;
    if (!room) {
      const profile = extractProfile(await api.getUserInfo());
      room = profile.classNames[0];
    }

    const url = ctx.config.meetUrlTemplate && room
      ? ctx.config.meetUrlTemplate.replace("{room}", encodeURIComponent(room))
      : ctx.config.entHost;

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setLabel(room ? `Rejoindre ${room}` : "Ouvrir Open ENT").setStyle(ButtonStyle.Link).setURL(url)
    );
    await interaction.editReply({ content: "🎥 Un clic → dans le cours.", components: [row] });
  }
};
