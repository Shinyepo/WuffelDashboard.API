import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { DiscordGuilds } from "../types";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Users {
  [key: string]: String | number | boolean | null | undefined | DiscordGuilds[] | Date;
  @Field()
  @PrimaryKey()
  id: String;

  @Field()
  @Property()
  username: String;

  @Field()
  @Property()
  avatar: String;

  @Field()
  @Property()
  discriminator: String;
  
  @Field()
  @Property()
  public_flags: number;

  @Field()
  @Property()
  flags: number;

  @Field()
  @Property({nullable: true})
  banner: String;

  @Field()
  @Property({nullable: true})
  banner_color: number;

  @Field()
  @Property({nullable: true})
  accent_color: number;

  @Field()
  @Property({nullable: true})
  locale: String;

  @Field()
  @Property({nullable: true})
  mfa_enabled: boolean;

  @Field()
  @Property({nullable: true})
  premium_type: number;

  @Field()
  @Property()
  email?: String;

  @Field()
  @Property()
  verified: boolean;

  @Field(() => [DiscordGuilds], {nullable: true})
  @Property({type: "json", nullable: true})
  guilds: DiscordGuilds[];

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
