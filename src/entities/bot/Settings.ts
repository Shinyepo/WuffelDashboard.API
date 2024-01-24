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
  @Property({ onCreate: () => true })
  active: boolean;

  @Field()
  @Property()
  prefix: string;

  @Field()
  @Property()
  userCount: string;

  @Field()
  @Property({ nullable: true })
  guildRole?: string;

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

  @Field(() => [String], {nullable: true})
  @Property({nullable: true, type: "array"})
  moderators: string[];
}
