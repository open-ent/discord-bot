import { ChatInputCommandInteraction } from "discord.js";
import { AppContext } from "../context";
import { EntApi } from "../ent/entApi";

/** Récupère un client API pour l'utilisateur, ou répond avec l'invite à `/openent link` et renvoie `undefined`. */
export async function requireEntApi(interaction: ChatInputCommandInteraction, ctx: AppContext): Promise<EntApi | undefined> {
  const api = await ctx.getEntApiFor(interaction.user.id);
  if (!api) {
    await interaction.reply({
      content: "Vous devez d'abord lier votre compte Open ENT avec `/openent link`.",
      ephemeral: true
    });
    return undefined;
  }
  return api;
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
