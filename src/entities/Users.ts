import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { DiscordGuilds } from "../types";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Users {
  [key: string]: String | number | boolean | null | undefined | DiscordGuilds[] | Date;
  @Field()
  @PrimaryKey()
  id: number;

  @Field()
  @Property()
  userId: string;
  
  @Field()
  @Property()
  username: string;

  @Field()
  @Property()
  avatar: string;

  @Field()
  @Property()
  discriminator: string;
  
  @Field()
  @Property()
  public_flags: number;

  @Field()
  @Property()
  flags: number;

  @Field()
  @Property({nullable: true})
  banner: string;

  @Field()
  @Property({nullable: true})
  banner_color: number;

  @Field()
  @Property({nullable: true})
  accent_color: number;

  @Field()
  @Property({nullable: true})
  locale: string;

  @Field()
  @Property({nullable: true})
  mfa_enabled: boolean;

  @Field({nullable: true})
  @Property({nullable: true})
  premium_type?: number;

  @Field()
  @Property()
  email?: string;

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
