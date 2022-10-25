import "reflect-metadata";
import "dotenv-safe/config";
import { MikroORM, wrap } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UsersResolver } from "./resolvers/Users";
import { createClient } from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import {
  DiscordGuilds,
  MyContext,
} from "./types";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import cors from "cors";
import axios from "axios";
import config from "./config";
import { Users } from "./entities/Users";
import { Tokens } from "./entities/Tokens";
import { DiscordUsersResolver } from "./resolvers/DiscordUser";
import { Settings } from "./entities/bot/Settings";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SettingsResolver } from "./resolvers/Settings";
import { DiscordResolver } from "./resolvers/Discord";

const main = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();
  app.set("trust proxy", 1);  
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  const RedisStore = connectRedis(session);
  let redisClient = createClient({
    legacyMode: true,
    url: process.env.REDIS_URL,
  });
  redisClient.connect().catch(console.error);

  redisClient.on("error", (err) => console.log(err));
  redisClient.on("connect", () => console.log("Connected to Redis"))
  

  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true, // keep session forever on
      }),
      cookie: {
        maxAge: 1000 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: false, // https
        sameSite: "lax",
        // domain: __prod__ ? "178.43.12.39" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UsersResolver, DiscordUsersResolver, SettingsResolver, DiscordResolver],
      validate: false,
    }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({ req, res }): MyContext => ({ em: orm.em.fork(), req, res }),
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  app.get("/discord/auth/callback", async (req, res) => {
    if (req.session.user)
      return res.redirect(process.env.CORS_ORIGIN + "/dashboard");
    const code = req.query.code;
    if (!code) return res.redirect(process.env.CORS_ORIGIN);
    const oauthResult = await axios({
      url: "https://discord.com/api/oauth2/token",
      method: "POST",
      data: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: code!.toString(),
        grant_type: "authorization_code",
        redirect_uri: `http://localhost:4000/discord/auth/callback`,
        scope: "identify",
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (oauthResult.status !== 200)
      return res.redirect(process.env.CORS_ORIGIN);
    const token = oauthResult.data as Tokens;
    if (!token) return res.redirect(process.env.CORS_ORIGIN);

    const me = await axios({
      url: "https://discord.com/api/users/@me",
      headers: {
        authorization: `${token.token_type} ${token.access_token}`,
      },
    });
    if (me.status !== 200) return res.redirect(process.env.CORS_ORIGIN);
    const userData = me.data as Users;
    const guilds = await axios({
      url: "https://discord.com/api/users/@me/guilds",
      headers: {
        authorization: `${token.token_type} ${token.access_token}`,
      },
    });
    if (guilds.status !== 200) return res.redirect(process.env.CORS_ORIGIN);
    const userGuilds = guilds.data as DiscordGuilds[];
    const filteredGuilds = userGuilds.filter(
      (guild) => (parseInt(guild.permissions, 10) & 0x8) === 0x8
    );

    if (filteredGuilds.length > 0) {
      const botGuilds = await orm.em.fork().find(Settings, {});
      if (botGuilds.length > 0) {
        filteredGuilds.forEach((guild) => {
          const isIn = botGuilds.find((x) => x.guildId === guild.id);
          if (isIn) {
            guild.in = true;
          }
        });
      }
    }

    userData.guilds = filteredGuilds;

    let user = await orm.em.fork().findOne(Users, { id: userData.id });
    
    let userTokens = await orm.em.fork().findOne(Tokens, { id: userData.id });

    const curr = new Date();
    
    
    curr.setSeconds(curr.getSeconds() + parseInt(token.expires_in.toString()));

    if (!user) {
      user = orm.em.fork().create(Users, userData);

      await orm.em.fork().persistAndFlush(user);
    } else {
      wrap(user).assign(userData);

      await orm.em.fork().persistAndFlush(user);
    }

    if (!userTokens) {
      userTokens = orm.em.fork().create(Tokens, {
        ...token,
        expires_in: curr,
        id: userData.id,
      });

      await orm.em.fork().persistAndFlush(userTokens);
    } else {
      wrap(userTokens).assign({ ...token, expires_in: curr });

      await orm.em.fork().persistAndFlush(userTokens);
    }
    req.session.userId = user?.id;

    res.redirect(process.env.CORS_ORIGIN + "/dashboard");
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log("Server up and running on localhost:" + process.env.PORT);
    console.log("Cors origin " + process.env.CORS_ORIGIN);
  });
};

main();

// var query = `query Discord($userData: DiscordUser!) {
//   DiscordLogin(user: $userData)
// }`;

// await axios({
//   url: "http://localhost:4000/graphql",
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   data: JSON.stringify({
//     query,
//     variables: {
//       userData,
//     },
//   }),
// });
