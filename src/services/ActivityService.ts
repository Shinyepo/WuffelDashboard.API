import { EntityManager } from "@mikro-orm/postgresql";
import { Activity } from "../entities/Activity";
import { LogActivity } from "../types";

export const logActivity = async (em: EntityManager, log: LogActivity) => {
  const { activity, activityType, guildId, userId } = log;
  const newEntry = await em.fork().create(Activity, {
    activity,
    activityType,
    userId,
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
