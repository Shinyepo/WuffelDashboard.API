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

  @Field({ nullable: true })
  @Property({ nullable: true })
  modRole: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  adminRole: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  muteRole: string;

  @Field({ nullable: true })
  @Property({ nullable: true, type: "text" })
  disabledCommands: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  systemNotice: Boolean;

  @Field({ nullable: true })
  @Property({ nullable: true })
  cleanup: Boolean;
}
