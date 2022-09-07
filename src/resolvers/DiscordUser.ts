import { Users } from "../entities/Users";
import { DiscordGuilds, MyContext } from "../types";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Settings } from "../entities/bot/Settings";
import { GuildTraffic } from "../entities/bot/GuildTraffic";
import { StreamLeaderboard } from "../entities/bot/StreamLeaderboard";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class DiscordUsersResolver {
  @Query(() => Users, { nullable: true })
  async me(@Ctx() { em, req, res }: MyContext): Promise<Users | null> {
    if (!req.session.userId) return null;
    const user = await em.findOne(Users, { id: req.session.userId });

    if (!user) {
      console.log("no user");
      await new Promise((resolver) =>
        req.session.destroy((err) => {
          if (err) {
            console.log(err);
            resolver(false);
            return;
          }
          res.clearCookie("qid");
          resolver(true);
        })
      );
    }
    return user;
  }

  @Query(() => [DiscordGuilds], { nullable: true })
  async guilds(@Ctx() { em, req }: MyContext): Promise<DiscordGuilds[] | null> {
    if (!req.session.userId) return null;
    const qb = em.createQueryBuilder(Users);

    const result = (await qb
      .select("guilds")
      .where({ id: req.session.userId })
      .execute("get")) as Users;
    if (!result) return null;
    const guilds = result.guilds as DiscordGuilds[];

    return guilds;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    // res.clearCookie("qid");
    // if (!req.session.userId) {
    //   return Promise.resolve(false);
    // }

    return new Promise((resolver) =>
      req.session.destroy((err) => {
        res.clearCookie("qid");
        if (err) {
          console.log(err);
          resolver(false);
          return;
        }

        return resolver(true);
      })
    );
  }

  @Query(() => Settings, { nullable: true })
  async currGuild(
    @Ctx() { em, req }: MyContext,
    @Arg("guildId") guildId: string
  ): Promise<Settings | null> {
    if (!req.session.userId) {
      return null;
    };
    const isUserTellingThruth = await em.findOne(Users, {
      id: req.session.userId,
    });
    if (isUserTellingThruth) {
      const usersGuild = isUserTellingThruth.guilds.find(
        (x) => x.id === guildId
      );
      if (!usersGuild) return null;
    }
    const guildSettings = await em.findOne(Settings, { guildId });
    return guildSettings;
  }

  @Query(() => [GuildTraffic], { nullable: true })
  async guildTraffic(
    @Ctx() { em, req }: MyContext,
    @Arg("guildId") guildId: string
  ): Promise<GuildTraffic[] | null> {
    if (!req.session.userId) return null;
    const context = em.fork();
    const qb = context.createQueryBuilder(Users);

    const result = (await qb
      .select("guilds")
      .where({ id: req.session.userId })
      .execute("get")) as Users;

    if (!result) return null;
    const guilds = result.guilds as DiscordGuilds[];
    const guild = guilds.find((x) => x.id === guildId);

    if (!guild) return null;

    const traffic = await context.find(GuildTraffic, { guildId });

    return traffic;
  }

  @Query(() => [StreamLeaderboard], { nullable: true })
  @UseMiddleware(isAuth)
  async streamerRanking(
    @Ctx() { em, req }: MyContext,
    @Arg("guildId") guildId: string
  ): Promise<StreamLeaderboard[] | null> {
    if (!req.session.userId) return null;
    const isUserTellingThruth = await em.findOne(Users, {
      id: req.session.userId,
    });
    if (isUserTellingThruth) {
      const usersGuild = isUserTellingThruth.guilds.find(
        (x) => x.id === guildId
      );
      if (!usersGuild) return null;
    }

    const leaderboard = await em.find(StreamLeaderboard, { guildId });
    if (leaderboard.length < 1) return null;
    leaderboard.sort((a, b) => {
      if (a.timeStreamed > b.timeStreamed) return -1;
      if (a.timeStreamed < b.timeStreamed) return 1;
      return 0;
    });
    return leaderboard;
  }
}
