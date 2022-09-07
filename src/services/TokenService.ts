import { EntityManager } from "@mikro-orm/knex";
import axios from "axios";
import { Tokens } from "../entities/Tokens";
import config from "../config";

export const getToken = async (em: EntityManager, userId: string) => {
  console.log("work");

  const userData = await em.findOne(Tokens, { id: "190561911492968448" });
  if (!userData) return null;
  if (userData.expires_in < new Date()) {
    const apiResult = await axios({
      url: "https://discord.com/api/v8/oauth2/token",
      method: "POST",
      data: new URLSearchParams({
        'client_id': config.clientId,
        'client_secret': config.clientSecret,
        'grant_type': 'refresh_token',
        'refresh_token': userData.refresh_token,
        redirect_uri: `http://localhost:4000/discord/auth/callback`
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (apiResult.status !== 200) {
      return null;
    }
    const response = apiResult.data as Tokens;
    const updatedUserData = await updateToken(em, userId, response);

    return updatedUserData?.access_token;
  }
  return userData.access_token;
};

export const updateToken = async (
  em: EntityManager,
  userId: String,
  response: Tokens
) => {
  const userData = await em.findOne(Tokens, { id: userId });
  if (!userData) {
    await insertNewToken(em, userId, response);
    return null;
  }
  userData.access_token = response.access_token;
  userData.expires_in = new Date(response.expires_in);
  userData.refresh_token = response.refresh_token;
  await em.flush();
  return userData;
};

export const insertNewToken = async (
  em: EntityManager,
  userId: String,
  response: Tokens
) => {
  const newEntry = await em.create(Tokens, {
    ...response,
    id: userId,
  });
  console.log(newEntry);

  await em.persistAndFlush(newEntry);
  return newEntry;
};
