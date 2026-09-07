import { Config } from "../config";

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

/**
 * Client OAuth2 "authorization code" pour le module `auth` d'entcore
 * (libs/entcore/auth, AuthController: GET /auth/oauth2/auth, POST /auth/oauth2/token).
 * Formats de requête/réponse conformes à la RFC 6749 (grant_type, client_id,
 * client_secret, code/refresh_token, redirect_uri en x-www-form-urlencoded).
 */
export class EntOAuthClient {
  constructor(
    private readonly config: Pick<
      Config,
      "entHost" | "entOAuthClientId" | "entOAuthClientSecret" | "entOAuthRedirectUri" | "entOAuthScope"
    >
  ) {}

  buildAuthorizeUrl(state: string): string {
    const url = new URL(`${this.config.entHost}/auth/oauth2/auth`);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", this.config.entOAuthClientId);
    url.searchParams.set("redirect_uri", this.config.entOAuthRedirectUri);
    url.searchParams.set("scope", this.config.entOAuthScope);
    url.searchParams.set("state", state);
    return url.toString();
  }

  async exchangeCode(code: string): Promise<TokenResponse> {
    return this.requestToken({
      grant_type: "authorization_code",
      code,
      redirect_uri: this.config.entOAuthRedirectUri
    });
  }

  async refresh(refreshToken: string): Promise<TokenResponse> {
    return this.requestToken({
      grant_type: "refresh_token",
      refresh_token: refreshToken
    });
  }

  private async requestToken(params: Record<string, string>): Promise<TokenResponse> {
    const body = new URLSearchParams({
      ...params,
      client_id: this.config.entOAuthClientId,
      client_secret: this.config.entOAuthClientSecret
    });
    const response = await fetch(`${this.config.entHost}/auth/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: body.toString()
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Échange OAuth2 échoué (${response.status}) : ${text.slice(0, 300)}`);
    }
    return JSON.parse(text) as TokenResponse;
  }
}
