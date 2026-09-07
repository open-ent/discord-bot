import "dotenv/config";
import { REST, Routes } from "discord.js";
import { buildOpenEntCommand } from "../src/discord/commands";

async function main(): Promise<void> {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!token || !clientId) {
    throw new Error("DISCORD_TOKEN et DISCORD_CLIENT_ID sont requis (voir .env.example)");
  }

  const command = buildOpenEntCommand().toJSON();
  const rest = new REST().setToken(token);

  const route = guildId ? Routes.applicationGuildCommands(clientId, guildId) : Routes.applicationCommands(clientId);
  await rest.put(route, { body: [command] });

  console.log(
    guildId
      ? `Commande /openent enregistrée sur le serveur ${guildId} (effective immédiatement).`
      : "Commande /openent enregistrée globalement (propagation ~1h)."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
