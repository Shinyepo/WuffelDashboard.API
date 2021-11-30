import { EntityManager } from "@mikro-orm/postgresql";
import { Request, Response } from "express";
import { Field, InputType, ObjectType } from "type-graphql";

export type MyContext = {
  em: EntityManager;
  req: Request;
  res: Response;
};

declare module "express-session" {
  export interface SessionData {
    [key: string]: any;
  }
}

export type DiscordTokenResponse = {
  access_token: String;
  token_type: String;
  expires_in: number;
  refresh_token: String;
  scope: String;
};

@ObjectType()
export class DiscordGuilds {
  @Field()
  id: String;
  @Field()
  name: String;
  @Field({ nullable: true })
  icon: String;
  @Field()
  owner: boolean;
  @Field()
  permissions: string;
  @Field()
  permissions_new: string;
  @Field(() => [String])
  features: String[];
  @Field({ defaultValue: false })
  in: boolean;
}

export class SessionUser {
  id: String;
  username: String;
  avatar: String;
  discriminator: String;
  public_flags: number;
  flags: number;
  locale: String;
  premium_type: number;
  email: String;
  verified: boolean;
  guilds: DiscordGuilds[];
  constructor() {}
}

@InputType()
export class DiscordUser {
  @Field()
  id: String;
  @Field()
  username: String;
  @Field()
  avatar: String;
  @Field()
  discriminator: String;
  @Field()
  public_flags: number;
  @Field()
  flags: number;
  @Field({ nullable: true })
  banner: String;
  @Field({ nullable: true })
  banner_color: number;
  @Field({ nullable: true })
  accent_color: number;
  @Field({ nullable: true })
  locale: String;
  @Field({ nullable: true })
  mfa_enabled: boolean;
  @Field()
  premium_type: number;
  @Field()
  email: String;
  @Field()
  verified: boolean;
  @Field(() => [DiscordGuilds])
  guilds: DiscordGuilds[];
}
@ObjectType()
export class IgnoredLogObject {
  @Field(() => [String])
  users: String[];
  @Field(() => [String])
  channels: String[];
}

@InputType()
export class LogObject {
  @Field()
  name: String;
  @Field()
  on: Boolean;
  @Field()
  channel: String;
  @Field(() => IgnoredLogObject)
  ignored: IgnoredLogObject;
}


