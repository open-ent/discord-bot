import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { OpenEntSubcommand } from "./types";

export const linkCommand: OpenEntSubcommand = {
  name: "link",
  build: (sub) => sub.setName("link").setDescription("Lier votre compte Open ENT à Discord"),
  async execute(interaction, ctx) {
    const state = ctx.pendingLinks.create(interaction.user.id);
    const authorizeUrl = ctx.oauth.buildAuthorizeUrl(state);

    const embed = new EmbedBuilder()
      .setTitle("🔗 Lier votre compte Open ENT")
      .setDescription(
        "Cliquez sur le bouton ci-dessous, connectez-vous à Open ENT, puis autorisez l'accès.\n" +
          "Le lien est valable 10 minutes et à usage unique."
      )
      .setColor(0x2f7ce0);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setLabel("Se connecter à Open ENT").setStyle(ButtonStyle.Link).setURL(authorizeUrl)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
