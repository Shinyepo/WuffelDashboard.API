import { Users } from "../entities/Users";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";

export const isAuth: MiddlewareFn<MyContext> = async (
  { context, args },
  next
) => {  
  if (!context.req.session.userId) {
    context.res.redirect("/");
    throw new Error("not authenticated");
  }
  if (args.guildId) {
    const isUserTellingThruth = await context.em.fork().findOne(Users, {
      userId: context.req.session.userId,
    });
    if (isUserTellingThruth) {
      if (args.guildId === "1") return next();
      const usersGuild = isUserTellingThruth.guilds.find(
        (x) => x.id === args.guildId
      );
      if (!usersGuild) throw new Error("not authenticated");
    }
  }

  return next();
};
