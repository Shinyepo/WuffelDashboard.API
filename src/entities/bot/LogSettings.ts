import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { LogObject } from "../../types";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity({ tableName: "bot.logsettings" })
export class LogSettings {
  
  @Field()
  @PrimaryKey()
  id: number;

  @Field()
  @Property()
  guildId: string;

  @Field(() => [LogObject], {nullable: true})
  @Property({type: "json", nullable: true})
  settings: LogObject[];

  @Field(() => String)
  @Property({ type: "date", onCreate: () => new Date() })
  createdAt: String;

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: String;
}
