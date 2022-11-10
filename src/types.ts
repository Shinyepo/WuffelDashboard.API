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

@ObjectType()
export class DiscordChannelSelectList {
  @Field()
  id: string;
  @Field({ nullable: true })
  type?: number;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  position?: number;
  @Field({ nullable: true })
  parent_id?: string;
  @Field({ nullable: true })
  guild_id?: string;
  @Field(() => [DiscordChannelSelectList], { nullable: true })
  channels?: DiscordChannelSelectList[];
}
export type DiscordChannel = {
  [key: string]: any;
  id: string;
  last_message_id?: string;
  type: number;
  name: string;
  position: number;
  parent_id?: string;
  topic?: string;
  guild_id: string;
  permission_overwrites?: string[];
  nsfw: boolean;
  rate_limit_per_user: number;
  banner?: string;
};

export type DiscordTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
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
@ObjectType("IgnoredLogObject")
@InputType("IgnoredLogObjectInput")
export class IgnoredLogObject {
  @Field(() => [String], { nullable: true })
  users?: String[];
  @Field(() => [String], { nullable: true })
  channels?: String[];
}

@ObjectType("LogObject")
@InputType("LogObjectInput")
export class LogObject {
  @Field()
  id: number;
  @Field()
  name: string;
  @Field()
  on: Boolean;
  @Field({ nullable: true })
  channel?: string;
  @Field(() => IgnoredLogObject, { nullable: true })
  ignored?: IgnoredLogObject;
}

@ObjectType()
export class rrResponse {
  @Field()
  success: Boolean;

  @Field()
  id: string;
}

@InputType()
export class settingsArgumentType {
  @Field()
  id: number;
  @Field()
  name: string;
  @Field()
  on: Boolean;
  @Field({ nullable: true })
  channel?: string;
  @Field(() => IgnoredLogObject, { nullable: true })
  ignored?: IgnoredLogObject;
}

@ObjectType()
export class LogActivity {
  @Field()
  id?: number;
  @Field()
  guildId: string;
  @Field()
  userId: string;
  @Field()
  username?: string;
  @Field()
  activity: string;
  @Field()
  activityType: boolean;
  @Field(() => Date)
  createdAt?: Date;
}
