import "dotenv/config";
import path from "node:path";

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Variable d'environnement manquante : ${name} (voir .env.example)`);
  }
  return value;
}

function optional(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : fallback;
}

export interface Config {
  discordToken: string;
  discordClientId: string;
  discordGuildId?: string;
  entHost: string;
  entOAuthClientId: string;
  entOAuthClientSecret: string;
  entOAuthRedirectUri: string;
  entOAuthScope: string;
  port: number;
  dataDir: string;
  meetUrlTemplate?: string;
}

let cached: Config | undefined;

/** Charge et valide la configuration depuis les variables d'environnement. */
export function loadConfig(): Config {
  if (cached) return cached;
  cached = {
    discordToken: required("DISCORD_TOKEN"),
    discordClientId: required("DISCORD_CLIENT_ID"),
    discordGuildId: process.env.DISCORD_GUILD_ID?.trim() || undefined,
    entHost: required("ENT_HOST").replace(/\/+$/, ""),
    entOAuthClientId: required("ENT_OAUTH_CLIENT_ID"),
    entOAuthClientSecret: required("ENT_OAUTH_CLIENT_SECRET"),
    entOAuthRedirectUri: required("ENT_OAUTH_REDIRECT_URI"),
    entOAuthScope: optional("ENT_OAUTH_SCOPE", "userinfo"),
    port: Number(optional("PORT", "3000")),
    dataDir: path.resolve(optional("DATA_DIR", "./data")),
    meetUrlTemplate: process.env.MEET_URL_TEMPLATE?.trim() || undefined
  };
  return cached;
}
