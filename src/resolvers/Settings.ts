import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Settings } from "../entities/bot/Settings";
import { LogSettings } from "../entities/bot/LogSettings";

@Resolver()
export class SettingsResolver {
  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getPrefix(
    @Ctx() { em }: MyContext,
    @Arg("guildId") guildId: string
  ): Promise<String | undefined> {
    const prefix = await em.findOne(Settings, { guildId });
    return prefix?.prefix;
  }

  @Mutation(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async setPrefix(
    @Ctx() { em }: MyContext,
    @Arg("guildId") guildId: string,
    @Arg("prefix") prefix: string
  ): Promise<String | null> {
    const settings = await em.findOne(Settings, { guildId });
    if (!settings) return null;
    settings.prefix = prefix;
    await em.flush();
    return settings.prefix;
  }

  @Query(() => LogSettings)
  @UseMiddleware(isAuth)
  async getLogSettings(
    @Ctx() { em }: MyContext,
    @Arg("guildId") guildId: string
  ): Promise<LogSettings | null> {
    const data = await em.findOne(LogSettings, {guildId});
    return data;
  }
}
