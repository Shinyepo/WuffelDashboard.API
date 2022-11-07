import { Migration } from '@mikro-orm/migrations';

export class Migration20221104130406 extends Migration {

  async up(): Promise<void> {
    this.addSql('create schema if not exists "bot";');

    this.addSql('create table "activity" ("id" serial primary key, "user_id" varchar(255) not null, "guild_id" varchar(255) not null, "activity_type" boolean not null, "activity" varchar(255) not null, "created_at" timestamptz(0) not null);');

    this.addSql('create table "bot"."guildtraffic" ("id" serial primary key, "guild_id" varchar(255) not null, "user_id" varchar(255) not null, "username" varchar(255) null, "nickname" varchar(255) null, "joined" boolean not null, "created_at" timestamptz(0) not null);');

    this.addSql('create table "bot"."logsettings" ("id" serial primary key, "guild_id" varchar(255) not null, "settings" jsonb null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "bot"."settings" ("id" serial primary key, "guild_id" varchar(255) not null, "active" boolean not null, "prefix" varchar(255) not null, "user_count" varchar(255) not null, "guild_role" varchar(255) null, "mod_role" varchar(255) null, "admin_role" varchar(255) null, "mute_role" varchar(255) null, "disabled_commands" text null, "system_notice" boolean null, "cleanup" boolean null);');

    this.addSql('create table "bot"."streamleaderboard" ("id" serial primary key, "guild_id" varchar(255) not null, "user_id" varchar(255) not null, "username" varchar(255) not null, "nickname" varchar(255) null, "time_streamed" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "bot"."streamwatch" ("id" serial primary key, "guild_id" varchar(255) not null, "user_id" varchar(255) not null, "starting_date" timestamptz(0) not null);');

    this.addSql('create table "tokens" ("id" serial primary key, "user_id" varchar(255) not null, "access_token" varchar(255) not null, "token_type" varchar(255) not null, "refresh_token" varchar(255) not null, "expires_in" timestamptz(0) not null, "scope" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "users" ("id" serial primary key, "user_id" varchar(255) not null, "username" varchar(255) not null, "avatar" varchar(255) not null, "discriminator" varchar(255) not null, "public_flags" int not null, "flags" int not null, "banner" varchar(255) null, "banner_color" int null, "accent_color" int null, "locale" varchar(255) null, "mfa_enabled" boolean null, "premium_type" int null, "email" varchar(255) not null, "verified" boolean not null, "guilds" jsonb null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
  }

}
