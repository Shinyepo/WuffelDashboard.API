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

@Resolver()
export class SettingsResolver {
  @Query(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async getPrefix(
    @Ctx() { em }: MyContext,
    @Arg("guildId") guildId: string
  ): Promise<String | undefined> {
    const context = em.fork();
    const prefix = await context.findOne(Settings, { guildId });
    return prefix?.prefix;
  }

  @Mutation(() => String, { nullable: true })
  @UseMiddleware(isAuth)
  async setPrefix(
    @Ctx() { em }: MyContext,
    @Arg("guildId") guildId: string,
    @Arg("prefix") prefix: string
  ): Promise<String | null> {
      const context = em.fork();
      const settings = await context.findOne(Settings, {guildId});
      if (!settings) return null;
      settings.prefix = prefix;
      await context.flush();
      return settings.prefix;
  }
}
