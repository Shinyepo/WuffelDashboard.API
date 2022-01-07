import { DiscordChannel, DiscordChannelSelectList, LogObject, MyContext } from "../types";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import axios from "axios";
import config from "../config";
import { isAuth } from "../middleware/isAuth";
import _ from "lodash";

@Resolver()
export class DiscordResolver {
  @Query(() => [DiscordChannelSelectList], { nullable: true })
  @UseMiddleware(isAuth)
  async getGuildChannels(
    @Ctx() {}: MyContext,
    @Arg("guildId") guildId: string
  ): Promise<DiscordChannelSelectList[] | null> {
    // const token = await getToken(em,req.session.userId);

    const apiResult = await axios({
      url: "https://discord.com/api/v9/guilds/" + guildId + "/channels",
      method: "GET",
      headers: {
        authorization: `Bot ${config.botToken}`,
      },
    });
    if (apiResult.status !== 200) {
      return null;
    }
    if (!apiResult.data) return null;
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
  }


  
}
