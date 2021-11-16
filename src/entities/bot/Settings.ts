import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity({ tableName: "bot.settings" })
export class Settings {
  @Field()
  @PrimaryKey()
  id: number;

  @Field()
  @Property()
  guildId: string;

  @Field()
  @Property()
  prefix: string;

  @Field()
  @Property()
  userCount: string;

  @Field()
  @Property({ nullable: true })
  modRole: string;

  @Field()
  @Property({ nullable: true })
  adminRole: string;

  @Field()
  @Property({ nullable: true })
  muteRole: string;

  @Field()
  @Property({ nullable: true, type: "text" })
  disabledCommands: string;

  @Field()
  @Property({ nullable: true })
  systemNotice: Boolean;

  @Field()
  @Property({ nullable: true })
  cleanup: Boolean;
}
