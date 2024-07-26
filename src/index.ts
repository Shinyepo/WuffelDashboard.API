import http from "http";
import "reflect-metadata";
import "dotenv-safe/config";
import { MikroORM, wrap } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroOrmConfig from "./mikro-orm.config";
import { UsersResolver } from "./resolvers/Users";
import { createClient } from "redis";
import rStore from "connect-redis";
import axios from "axios";
import config from "./config";
import { Users } from "./entities/Users";
import { Tokens } from "./entities/Tokens";
import { DiscordUsersResolver } from "./resolvers/DiscordUser";
import { SettingsResolver } from "./resolvers/Settings";
import { DiscordResolver } from "./resolvers/Discord";
import { ActivityResolver } from "./resolvers/Activity";
import { getGuilds } from "./services/GuildService";
import session from "express-session";
import { buildSchemaSync } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import cors from "cors";
import express from "express";
import { MyContext } from "./types";

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();
  const httpServer = http.createServer(app);
  // app.set("trust proxy", 1);
  // app.use(

  // );

  let redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  redisClient.connect().catch(console.error);

  app.set("trust proxy", 1);

  redisClient.on("error", (err) => console.log(err));
  redisClient.on("connect", () => console.log("Connected to Redis"));

  const RedisStore = new rStore({
    client: redisClient,
    disableTouch: true,
  });

  app.use(
    session({
      name: "qid",
      store: RedisStore,
      cookie: {
        maxAge: 1000 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: true, // https
        sameSite: "lax",
        domain: ".shinyepo.dev"
      },
      saveUninitialized: false,
      secret: process.env.SECRET,
      resave: false,
    })
  );
  const schema = await buildSchemaSync({
    resolvers: [
      UsersResolver,
      DiscordUsersResolver,
      SettingsResolver,
      DiscordResolver,
      ActivityResolver,
    ],
    validate: true,
  });

  const apolloServer = new ApolloServer<MyContext>({
    schema: schema,
    // includeStacktraceInErrorResponses: true,
    introspection: true,
    plugins: [ApolloServerPluginLandingPageProductionDefault({
      footer: false,
    })]
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      credentials: true,
      origin: process.env.CORS_ORIGIN,
    }),
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({
        em: orm.em.fork(),
        req,
        res,
      }),
    })
  );

  app.get("/discord/auth/callback", async (req, res) => {
    if (req.session.user)
      return res.redirect(process.env.CORS_ORIGIN + "/dashboard");
    const code = req.query.code;
    if (!code) return res.redirect(process.env.CORS_ORIGIN);

    const oauthResult = await axios.post(
      "https://discord.com/api/v10/oauth2/token",
      new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: code!.toString(),
        grant_type: "authorization_code",
        redirect_uri: `https://wuffelapi.shinyepo.dev/discord/auth/callback`,
        scope: "identify",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    
    if (oauthResult.status !== 200)
      return res.redirect(process.env.CORS_ORIGIN);
    const token = oauthResult.data as Tokens;
    if (!token) return res.redirect(process.env.CORS_ORIGIN);

    const me = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${token.token_type} ${token.access_token}`,
      },
    });
    if (me.status !== 200) return res.redirect(process.env.CORS_ORIGIN);
    const userData = me.data as Users;

    const filteredGuilds = await getGuilds(orm.em.fork(), userData.userId);
    userData.guilds = filteredGuilds ?? [];

    let user = await orm.em
      .fork()
      .findOne(Users, { userId: userData.id.toString() });
      
    let userTokens = await orm.em
      .fork()
      .findOne(Tokens, { userId: userData.id.toString() });

    const curr = new Date();

    curr.setSeconds(curr.getSeconds() + parseInt(token.expires_in.toString()));

    if (!user) {
      user = orm.em.fork().create(Users, {
        ...userData,
        id: undefined,
        userId: userData.id.toString(),
      });

      await orm.em.fork().persistAndFlush(user);
    } else {
      wrap(user).assign({
        ...userData,
        id: user.id,
        userId: userData.id.toString(),
      });

      await orm.em.fork().persistAndFlush(user);
    }

    if (!userTokens) {
      userTokens = orm.em.fork().create(Tokens, {
        ...token,
        expires_in: curr,
        userId: userData.id.toString(),
      });

      await orm.em.fork().persistAndFlush(userTokens);
    } else {
      wrap(userTokens).assign({ ...token, expires_in: curr });

      await orm.em.fork().persistAndFlush(userTokens);
    }
    req.session.userId = user?.userId;

    res.redirect(process.env.CORS_ORIGIN + "/dashboard");
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );

  console.log(`🚀 Server ready at http://localhost:4000/`);
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
