const config = {
  apiEndpoint: "https://discord.com/api",
  botToken: "",
  clientId: "",
  clientSecret: "",
  redirectUri: "http://localhost:4000/discord/auth/callback",
  scope: ["identify", "guilds"],
  grantType: "authorization_code",
  code: "query code",
};

export default config;
