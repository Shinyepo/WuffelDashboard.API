import { Arg, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Activity } from "../entities/Activity";
import { isAuth } from "../middleware/isAuth";
import { LogActivity, MyContext } from "../types";

@Resolver()
export class ActivityResolver {
  @Query(() => [LogActivity])
  @UseMiddleware(isAuth)
  async getActivity(
    @Ctx() { em }: MyContext,
    @Arg("guildId") guildId: string
  ): Promise<LogActivity[]> {
    const lastWeek = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7);
    const res = await em.fork().find(Activity, {
      guildId,
      createdAt: { $gt: lastWeek },
    });
    if (!res) return Promise.reject(false);
    return Promise.resolve(res.reverse());
  }
}
