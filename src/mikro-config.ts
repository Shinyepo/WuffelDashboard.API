import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import path from "path";
import { __prod__ } from "./constants";
import { GuildTraffic } from "./entities/bot/GuildTraffic";
import { LogSettings } from "./entities/bot/LogSettings";
import { Settings } from "./entities/bot/Settings";
import { StreamLeaderboard } from "./entities/bot/StreamLeaderboard";
import { StreamWatch } from "./entities/bot/StreamWatch";
import { Tokens } from "./entities/Tokens";
import { Users } from "./entities/Users";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [Users, Tokens, Settings, StreamLeaderboard, StreamWatch, GuildTraffic, LogSettings],
  clientUrl: process.env.DATABASE_URL,
  type: "postgresql",
  debug: !__prod__,
  
} as Options<PostgreSqlDriver>;
  