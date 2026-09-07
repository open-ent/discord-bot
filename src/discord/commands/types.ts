import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from "discord.js";
import { AppContext } from "../../context";

export interface OpenEntSubcommand {
  name: string;
  build(sub: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder;
  execute(interaction: ChatInputCommandInteraction, ctx: AppContext): Promise<void>;
}
