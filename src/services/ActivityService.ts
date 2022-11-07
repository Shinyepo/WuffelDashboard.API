import { EntityManager } from "@mikro-orm/postgresql";
import { Activity } from "../entities/Activity";
import { Users } from "../entities/Users";
import { LogActivity } from "../types";

export const logActivity = async (em: EntityManager, log: LogActivity) => {
  const { activity, activityType, guildId, userId } = log;
  const user = await em.findOne(Users, {
    userId,
  });
  if (!user) return;

  const newEntry = await em.fork().create(Activity, {
    activity,
    activityType,
    userId,
    username: user.username + "#" + user.discriminator,
    guildId,
    createdAt: new Date(),
  });

  await em.fork().persistAndFlush(newEntry);

  return;
};

export const getActivity = async (em: EntityManager, guildId: string) => {
  const res = await em.fork().find(Activity, {
    guildId,
  });
  if (!res) return Promise.reject();
  return;
};
