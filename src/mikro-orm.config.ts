import { Migrator } from "@mikro-orm/migrations";
import { __prod__ } from "./constants";
import {
  defineConfig,
  EntityManager,
} from "@mikro-orm/postgresql";

type mycontext = {
  em: EntityManager;
};

export default defineConfig({
  extensions: [Migrator],
  migrations: {
    path: "./dist/migrations",
    pathTs: "./src/migrations",
    glob: "!(*.d).{js,ts}",
    emit: "ts",
  },
  entities: ["./dist/entities/**/*.js"],
  entitiesTs: ["./src/entities/**/*.ts"],
  clientUrl: process.env.DATABASE_URL,
  debug: !__prod__,
});
