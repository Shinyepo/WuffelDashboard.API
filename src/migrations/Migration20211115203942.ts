import { Migration } from '@mikro-orm/migrations';

export class Migration20211115203942 extends Migration {

  async up(): Promise<void> {
    this.addSql('CREATE SCHEMA IF NOT EXISTS bot');

    this.addSql('create table "bot"."guildtraffic" ("id" serial primary key, "guild_id" varchar(255) not null, "user_id" varchar(255) not null, "joined" bool not null, "created_at" timestamptz(0) not null);');

    this.addSql('create table "bot"."streamwatch" ("id" serial primary key, "guild_id" varchar(255) not null, "user_id" varchar(255) not null, "starting_date" timestamptz(0) not null);');

    this.addSql('create table "bot"."streamleaderboard" ("id" serial primary key, "guild_id" varchar(255) not null, "user_id" varchar(255) not null, "time_streamed" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "bot"."settings" ("id" serial primary key, "guild_id" varchar(255) not null, "prefix" varchar(255) not null, "user_count" varchar(255) not null, "mod_role" varchar(255) null, "admin_role" varchar(255) null, "mute_role" varchar(255) null, "disabled_commands" text null, "system_notice" bool null, "cleanup" bool null);');

    this.addSql('create table "tokens" ("id" varchar(255) not null, "access_token" varchar(255) not null, "token_type" varchar(255) not null, "refresh_token" varchar(255) not null, "expires_in" timestamptz(0) not null, "scope" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "tokens" add constraint "tokens_pkey" primary key ("id");');

    this.addSql('create table "users" ("id" varchar(255) not null, "username" varchar(255) not null, "avatar" varchar(255) not null, "discriminator" varchar(255) not null, "public_flags" int4 not null, "flags" int4 not null, "banner" varchar(255) null, "banner_color" int4 null, "accent_color" int4 null, "locale" varchar(255) null, "mfa_enabled" bool null, "premium_type" int4 null, "email" varchar(255) not null, "verified" bool not null, "guilds" jsonb null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "users" add constraint "users_pkey" primary key ("id");');
  }

}
