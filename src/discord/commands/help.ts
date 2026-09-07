import { EmbedBuilder } from "discord.js";
import { OpenEntSubcommand } from "./types";

const COMMANDS: Array<[string, string]> = [
  ["link", "Lier votre compte Open ENT à Discord"],
  ["classes", "Mes classes et groupes"],
  ["devoirs", "Mes devoirs à venir"],
  ["agenda", "Mon emploi du temps du jour"],
  ["ressources", "Mes ressources récentes"],
  ["annonce", "Publier une annonce dans une classe (enseignant)"],
  ["partager", "Partager une ressource avec une classe"],
  ["meet", "Rejoindre une visioconférence"]
];

export const helpCommand: OpenEntSubcommand = {
  name: "help",
  build: (sub) => sub.setName("help").setDescription("Afficher l'aide du bot Open ENT"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🤖 Open ENT Bot")
      .setDescription("Commandes disponibles :")
      .addFields(COMMANDS.map(([name, desc]) => ({ name: `/openent ${name}`, value: desc })))
      .setColor(0x2f7ce0);
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
