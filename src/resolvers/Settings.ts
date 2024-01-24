import { isAuth } from "../middleware/isAuth";
import {
  DefaultSettings,
  IgnoredLogObject,
  LogObject,
  MyContext,
  settingsArgumentType,
} from "../types";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { LogSettings } from "../entities/bot/LogSettings";
import { omitTypename } from "../middleware/omitFields";
import { logActivity } from "../services/ActivityService";

@Resolver()
export class SettingsResolver {
  @Query(() => LogSettings)
  @UseMiddleware(isAuth)
  @UseMiddleware(omitTypename)
  async getLogSettings(
    @Ctx() { em }: MyContext,
    @Arg("guildId") guildId: string
  ): Promise<LogSettings | null> {
    if (guildId === "1") {
      const data = await em.findOne(LogSettings, { guildId });
      return data;
    }
    const data = await em.findOne(LogSettings, { guildId });
    if (!data) {
      const newEntry = em.create(LogSettings, {
        guildId,
        settings: DefaultSettings,
      });

      await em.persistAndFlush(newEntry);
      return Promise.resolve(newEntry);
    }
    return Promise.resolve(data);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(omitTypename)
  async setLogSettings(
    @Ctx() { em, req }: MyContext,
    @Arg("guildId") guildId: string,
    @Arg("settings", () => [settingsArgumentType])
    settings: settingsArgumentType[]
  ): Promise<Boolean> {
    const logSettings = await em.findOne(LogSettings, { guildId });

    await logActivity(em, {
      activity: "logs.channelConfiguration",
      userId: req.session.userId,
      guildId,
      activityType: true,
    });

    if (!logSettings) {
      const newEntry = await em.create(LogSettings, {
        guildId,
        settings,
      });
      await em.persistAndFlush(newEntry);
      return Promise.resolve(true);
    }
    logSettings.settings = settings;
    await em.persistAndFlush(logSettings);
    return Promise.resolve(true);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  @UseMiddleware(omitTypename)
  async setIgnoredSettings(
    @Ctx() { em, req }: MyContext,
    @Arg("guildId") guildId: string,
    @Arg("event") event: string,
    @Arg("settings", () => IgnoredLogObject)
    settings: IgnoredLogObject
  ): Promise<Boolean> {
    const logSettings = await em.fork().findOne(LogSettings, { guildId });

    if (!logSettings)
      return Promise.reject("Setting is already set with that value.");

    const eventSettings = logSettings.settings;
    const foundSetting = eventSettings?.find((x) => x.name === event);

    await logActivity(em, {
      activity: "logs.ignoredConfiguration",
      userId: req.session.userId,
      guildId,
      activityType: true,
    });

    if (!eventSettings || !foundSetting) {
      const newSetting = {
        id: logSettings.settings?.length ?? "0",
        name: event,
        on: false,
        ignored: settings,
      } as LogObject;
      logSettings.settings?.push(newSetting);

      await em.fork().persistAndFlush(logSettings);
      return Promise.resolve(true);
    }

    foundSetting.ignored = settings;
    logSettings.settings = eventSettings;
    await em.fork().persistAndFlush(logSettings);

    return Promise.resolve(true);
  }
}
