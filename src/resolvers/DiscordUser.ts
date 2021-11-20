import { Users } from "../entities/Users";
import { DiscordGuilds, MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Settings } from "../entities/bot/Settings";

@Resolver()
export class DiscordUsersResolver {
  @Query(() => Users, { nullable: true })
  async me(@Ctx() { em, req, res }: MyContext): Promise<Users | null> {
    
    console.log("request from urql ",req.session);

    if (!req.session.userId) return null;
    const user = await em.findOne(Users, { id: req.session.userId });
    // console.log(user);

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
  async guilds(
    @Ctx() { em, req }: MyContext
  ): Promise<DiscordGuilds[] | null> {
    console.log("request from urql ",req.session);
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
    console.log("request from urql ",req.session);
    res.clearCookie("qid");
    if (!req.session.userId) {
      return false;
    }

    return new Promise((resolver) =>
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          resolver(false);
          return;
        }

        resolver(true);
      })
    );
  }

  @Query(() => Settings, {nullable: true})
  async currGuild(
    @Ctx() { em, req }: MyContext,
    @Arg("guildId") guildId : string
  ) : Promise<Settings | null> {
    console.log("request from urql ",req.session);
    if (!req.session.userId) return null;
    const isUserTellingThruth = await em.findOne(Users, {id: req.session.userId});
    if (isUserTellingThruth) {
      const usersGuild = isUserTellingThruth.guilds.find(x => x.id === guildId)
      if (!usersGuild) return null;
    }
    const guildSettings = await em.findOne(Settings, {guildId})
    return guildSettings;
  }
}
