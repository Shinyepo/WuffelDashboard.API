import { Users } from "../entities/Users";
import { DiscordGuilds, MyContext } from "../types";
import { Query, Ctx, Resolver } from "type-graphql";

@Resolver()
export class DiscordUsersResolver {
    @Query(() => [DiscordGuilds], { nullable: true })
    async getPrefix(@Ctx() { em, req }: MyContext): Promise<DiscordGuilds[] | null> {
      if (!req.session.userId) return null;

    }

}