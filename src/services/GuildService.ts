import { EntityManager } from "@mikro-orm/postgresql";
import axios from "axios";
import { Settings } from "../entities/bot/Settings";
import { DiscordGuilds } from "../types";
import { getToken } from "./TokenService";

export const getGuilds = async (em: EntityManager, userId: string) => {
  const token = await getToken(em.fork(), userId);
  if (!token) return null;
  const guilds = await axios({
    url: "https://discord.com/api/users/@me/guilds",
    headers: {
      authorization: `${token.token_type} ${token.token}`,
    },
  });
  if (guilds.status !== 200) return;
  const userGuilds = guilds.data as DiscordGuilds[];
  const filteredGuilds = userGuilds.filter(
    (guild) => (parseInt(guild.permissions, 10) & 0x8) === 0x8
  );
  const filteredIds = filteredGuilds.map((x) => x.id);

  if (filteredGuilds.length > 0) {
    const botGuilds = await em
      .fork()
      .find(Settings, { guildId: filteredIds as any });

    if (botGuilds.length > 0) {
      filteredGuilds.forEach((guild) => {
        const isIn = botGuilds.find((x) => x.guildId === guild.id);
        if (isIn) {
          guild.in = true;
        }
      });
    }
    return filteredGuilds;
  }
  return filteredGuilds;
};
