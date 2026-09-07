import { SlashCommandBuilder } from "discord.js";
import { agendaCommand } from "./agenda";
import { annonceCommand } from "./annonce";
import { classesCommand } from "./classes";
import { devoirsCommand } from "./devoirs";
import { helpCommand } from "./help";
import { linkCommand } from "./link";
import { meetCommand } from "./meet";
import { partagerCommand } from "./partager";
import { ressourcesCommand } from "./ressources";
import { OpenEntSubcommand } from "./types";

export const subcommands: OpenEntSubcommand[] = [
  helpCommand,
  linkCommand,
  classesCommand,
  devoirsCommand,
  agendaCommand,
  ressourcesCommand,
  annonceCommand,
  partagerCommand,
  meetCommand
];

export const subcommandsByName = new Map(subcommands.map((c) => [c.name, c]));

export function buildOpenEntCommand(): SlashCommandBuilder {
  const command = new SlashCommandBuilder().setName("openent").setDescription("Commandes Open ENT");
  for (const subcommand of subcommands) {
    command.addSubcommand((sub) => subcommand.build(sub));
  }
  return command;
}
