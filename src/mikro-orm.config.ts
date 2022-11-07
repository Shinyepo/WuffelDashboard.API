import { Options } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { __prod__ } from "./constants";

export default {
  migrations: {
    path: "./dist/migrations",
    pathTs: "./src/migrations",
    glob:"!(*.d).{js,ts}",
    emit: "ts"
  },
  entities: ['./dist/entities/**/*.js'],
  entitiesTs: ['./src/entities/**/*.ts'],
  clientUrl: process.env.DATABASE_URL,
  type: "postgresql",
  debug: !__prod__,
  
} as Options<PostgreSqlDriver>;
  