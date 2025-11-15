// auth-config.ts
// Configurație Auth0 pentru React Native / Expo

export interface AuthConfig {
  domain: string;
  clientId: string;
  redirectUri: string;
  logoutRedirectUri: string;
  audience?: string;
  scope?: string;
}

export const authConfig: AuthConfig = {
  domain: "YOUR_AUTH0_DOMAIN",       // ex: "dev-xyz123.us.auth0.com"
  clientId: "YOUR_AUTH0_CLIENT_ID",  // din dashboard → Applications → Native
  redirectUri: "myapp://callback",   // schema custom pentru Expo
  logoutRedirectUri: "myapp://logout",
  audience: "https://YOUR_AUTH0_DOMAIN/api/v2/", // optional, doar dacă ai API
  scope: "openid profile email",    // ce informații vrei să primești
};
