import fs from "node:fs/promises";
import path from "node:path";
import { Config } from "../config";

export interface LinkedAccount {
  entHost: string;
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  /** Epoch ms auquel l'access_token expire. */
  expiresAt: number;
  scope?: string;
}

type LinksById = Record<string, LinkedAccount>;

/**
 * Persistance simple en fichier JSON (un discordUserId -> un compte Open ENT lié).
 * Un process unique suffit pour ce bot : pas besoin d'une base de données pour le MVP.
 * Les écritures sont sérialisées via `queue` pour éviter une corruption en cas d'appels concurrents.
 */
export class LinkStore {
  private readonly filePath: string;
  private queue: Promise<void> = Promise.resolve();

  constructor(config: Pick<Config, "dataDir">) {
    this.filePath = path.join(config.dataDir, "links.json");
  }

  async get(discordUserId: string): Promise<LinkedAccount | undefined> {
    const all = await this.readAll();
    return all[discordUserId];
  }

  async save(discordUserId: string, account: LinkedAccount): Promise<void> {
    await this.mutate((all) => {
      all[discordUserId] = account;
    });
  }

  async delete(discordUserId: string): Promise<void> {
    await this.mutate((all) => {
      delete all[discordUserId];
    });
  }

  private async readAll(): Promise<LinksById> {
    try {
      const raw = await fs.readFile(this.filePath, "utf8");
      return JSON.parse(raw) as LinksById;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return {};
      throw err;
    }
  }

  private async writeAll(all: LinksById): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    const tmpPath = `${this.filePath}.tmp`;
    await fs.writeFile(tmpPath, JSON.stringify(all, null, 2), "utf8");
    await fs.rename(tmpPath, this.filePath);
  }

  /** Enchaîne les lectures/écritures pour sérialiser les accès concurrents au fichier. */
  private mutate(fn: (all: LinksById) => void): Promise<void> {
    this.queue = this.queue.then(async () => {
      const all = await this.readAll();
      fn(all);
      await this.writeAll(all);
    });
    return this.queue;
  }
}
