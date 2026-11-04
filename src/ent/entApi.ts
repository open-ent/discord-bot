import {
  EntCourse,
  EntDocument,
  EntHomework,
  EntProfile,
  EntRecipientGroup,
  EntUserInfo
} from "./types";

export class EntApiError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = "EntApiError";
  }
}

/** Client HTTP authentifié par Bearer token (OAuth2) vers l'API REST entcore. */
export class EntApi {
  constructor(
    private readonly host: string,
    private readonly accessToken: string
  ) {}

  private async request<T>(path: string, options: { method?: string; query?: Record<string, unknown>; body?: unknown } = {}): Promise<T> {
    const { method = "GET", query, body } = options;
    const url = new URL(`${this.host}${path}`);
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) value.forEach((v) => url.searchParams.append(key, String(v)));
      else url.searchParams.set(key, String(value));
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${this.accessToken}`
    };
    if (body !== undefined) headers["Content-Type"] = "application/json";

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new EntApiError(`Open ENT a répondu ${response.status} sur ${path} : ${text.slice(0, 300)}`, response.status);
    }
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  getUserInfo(): Promise<EntUserInfo> {
    return this.request<EntUserInfo>("/auth/oauth2/userinfo");
  }

  /** GET /diary/homeworks/own/:startDate/:endDate/:structureId (module cahier-de-textes). */
  getOwnHomeworks(structureId: string, startDate: string, endDate: string): Promise<EntHomework[]> {
    return this.request<EntHomework[]>(`/diary/homeworks/own/${startDate}/${endDate}/${structureId}`);
  }

  /** GET /workspace/documents (module workspace d'entcore). */
  async getDocuments(): Promise<EntDocument[]> {
    const data = await this.request<EntDocument[] | { documents?: EntDocument[] }>("/workspace/documents");
    if (Array.isArray(data)) return data;
    return data.documents ?? [];
  }

  /**
   * POST /edt/structures/:structureId/common/courses/:startDate/:endDate (module edt).
   * Contrat non revérifié sur une instance réelle depuis ce poste (pas d'accès réseau) :
   * si le format évolue côté module edt, ajuster ici en priorité
   * (voir modules/edt/src/main/java/fr/cgi/edt/controllers/CourseController.java).
   */
  getCourses(structureId: string, startDate: string, endDate: string, groupNames: string[]): Promise<EntCourse[]> {
    return this.request<EntCourse[]>(`/edt/structures/${structureId}/common/courses/${startDate}/${endDate}`, {
      method: "POST",
      body: {
        groupNames,
        teacherIds: [],
        groupIds: [],
        groupExternalIds: [],
        startTime: "00:00",
        endTime: "23:59",
        union: true
      }
    });
  }

  /** GET /conversation/visible : groupes/utilisateurs visibles pour l'envoi de messages. */
  async findGroupByName(search: string): Promise<EntRecipientGroup | undefined> {
    const data = await this.request<{ groups?: EntRecipientGroup[] }>("/conversation/visible", {
      query: { search }
    });
    const groups = data.groups ?? [];
    const needle = search.trim().toLowerCase();
    return (
      groups.find((g) => (g.groupDisplayName ?? g.name ?? "").toLowerCase() === needle) ??
      groups.find((g) => (g.groupDisplayName ?? g.name ?? "").toLowerCase().includes(needle))
    );
  }

  /** POST /conversation/send. */
  sendMessage(message: { to: string[]; subject: string; body: string }): Promise<void> {
    return this.request("/conversation/send", {
      method: "POST",
      body: { to: message.to, cc: [], subject: message.subject, body: message.body }
    });
  }
}

/**
 * Lecture défensive du profil dans /auth/oauth2/userinfo : le nom exact des
 * champs dépend de l'adaptateur configuré côté plateforme, donc on essaie
 * plusieurs variantes plutôt que de figer un seul nom de champ.
 */
export function extractProfile(info: EntUserInfo): EntProfile {
  const displayName =
    info.username ??
    ([info.firstName ?? info.given_name, info.lastName ?? info.family_name].filter(Boolean).join(" ").trim() ||
      "Utilisateur Open ENT");
  return {
    displayName,
    profile: info.type,
    classNames: asStringArray(info.classNames),
    structureNames: asStringArray(info.structureNames),
    structureIds: asStringArray(info.structures),
    groupNames: asStringArray(info.groupsNames)
  };
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}
