import {
  DiscordChannel,
  DiscordChannelSelectList,
  DiscordGuilds,
  MyContext,
} from "../types";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import axios from "axios";
import config from "../config";
import { isAuth } from "../middleware/isAuth";
import { GuildTraffic } from "../entities/bot/GuildTraffic";
import { omitTypename } from "../middleware/omitFields";
import { Users } from "../entities/Users";
import { Settings } from "../entities/bot/Settings";
import { logActivity } from "../services/ActivityService";
@Resolver()
export class DiscordResolver {
  @Query(() => [DiscordChannelSelectList], { nullable: true })
  @UseMiddleware(isAuth)
  async getGuildChannels(
    @Ctx() {}: MyContext,
    @Arg("guildId") guildId: string
  ): Promise<DiscordChannelSelectList[]> {
    // const token = await getToken(em,req.session.userId);
    try {
      const apiResult = await axios({
        url: "https://discord.com/api/v9/guilds/" + guildId + "/channels",
        method: "GET",
        headers: {
          authorization: `Bot ${config.botToken}`,
        },
      });

      if (!apiResult) return new Array<DiscordChannelSelectList>();
      if (apiResult.status !== 200) {
        return new Array<DiscordChannelSelectList>();
      }
      if (!apiResult.data) return new Array<DiscordChannelSelectList>();

      const guildChannels = apiResult.data as DiscordChannel[];

      const textChannels = [] as DiscordChannelSelectList[];
      guildChannels.map((x) => {
        if (x.type === 0 || x.type === 4) {
          textChannels.push({
            id: x.id,
            name: x.name,
            guild_id: x.guild_id,
            position: x.position,
            type: x.type,
            parent_id: x.parent_id,
            channels: [] as DiscordChannelSelectList[],
          });
        }
      });

      const categoryList = [
        { id: "0", type: 4, name: "uncategorized", channels: [] },
      ] as DiscordChannelSelectList[];
      textChannels.map((x) => {
        if (x.type === 4) {
          x.channels = [] as DiscordChannelSelectList[];
          categoryList.push(x);
        }
      });

      categoryList.sort((a, b) => {
        if (a.position === undefined || b.position === undefined) return 1;
        if (a.position > b.position) return 1;
        if (a.position < b.position) return -1;
        return 0;
      });
      guildChannels.map((x) => {
        if (x.type === 0) {
          if (x.parent_id) {
            categoryList.find((a) => a.id === x.parent_id)?.channels?.push(x);
          } else {
            categoryList.find((a) => a.id === "0")?.channels?.push(x);
          }
        }
      });

      for (const cat of categoryList) {
        if (cat.id !== "0") {
          cat.channels?.sort((a, b) => {
            if (a.position === undefined || b.position === undefined) return 1;
            if (a.position > b.position) return 1;
            if (a.position < b.position) return -1;
            return 0;
          });
        }
      }

      return categoryList;
    } catch (error) {
      console.error(error);
      return new Array<DiscordChannelSelectList>();
    }
  }

  @Query(() => [GuildTraffic], { nullable: true })
  @UseMiddleware(omitTypename)
  async guildTraffic(
    @Ctx() { em, req }: MyContext,
    @Arg("guildId") guildId: string
  ): Promise<GuildTraffic[] | null> {
    if (!req.session.userId) return null;
    const context = em.fork();
    const qb = context.createQueryBuilder(Users);

    const result = (await qb
      .select("guilds")
      .where({ userId: req.session.userId })
      .execute("get")) as Users;

    if (!result) return null;
    const guilds = result.guilds as DiscordGuilds[];
    const guild = guilds.find((x) => x.id === guildId);

    if (!guild) return null;
    const lastDay = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);

    const traffic = await context.find(GuildTraffic, {
      guildId,
      createdAt: { $gt: lastDay },
    });

    return traffic;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async toggleBot(
    @Ctx() { em, req }: MyContext,
    @Arg("guildId") guildId: string,
    @Arg("state") state: boolean
  ): Promise<boolean> {
    const settings = await em.fork().findOne(Settings, { guildId });
    if (!settings) return Promise.reject(false);
    if (state === settings.active) return Promise.reject(false);
    settings.active = !settings.active;
    await em.fork().persistAndFlush(settings);
    await logActivity(em, {
      activity: "settings.mainSwitch",
      userId: req.session.userId,
      guildId,
      activityType: settings.active,
    });
    return Promise.resolve(true);
  }
}
