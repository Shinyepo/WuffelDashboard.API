import { EntityManager } from "@mikro-orm/knex";
import axios from "axios";
import { Tokens } from "../entities/Tokens";
import config from "../config";

export const getToken = async (em: EntityManager, userId: string) => {
  const userData = await em.findOne(Tokens, { userId });
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
    const updatedUserData = await updateToken(em.fork(), userId, response);

    return {
      token: updatedUserData?.access_token,
      token_type: updatedUserData?.token_type
    };
  }
  return {
    token: userData.access_token,
    token_type: userData.token_type
  }
};

export const updateToken = async (
  em: EntityManager,
  userId: String,
  response: Tokens
) => {
  const userData = await em.findOne(Tokens, { userId });
  if (!userData) {
    await insertNewToken(em.fork(), userId, response);
    return null;
  }
  userData.access_token = response.access_token;
  userData.expires_in = new Date(response.expires_in);
  userData.refresh_token = response.refresh_token;
  await em.persistAndFlush(userData);
  return userData;
};

export const insertNewToken = async (
  em: EntityManager,
  userId: String,
  response: Tokens
) => {
  const newEntry = await em.create(Tokens, {
    ...response,
    userId,
  });

  await em.persistAndFlush(newEntry);
  return newEntry;
};
