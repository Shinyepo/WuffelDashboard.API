import { Migration } from '@mikro-orm/migrations';

export class Migration20240124114046 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "activity" alter column "created_at" type date using ("created_at"::date);');

    this.addSql('alter table "bot"."guildtraffic" alter column "created_at" type date using ("created_at"::date);');

    this.addSql('alter table "bot"."logsettings" alter column "created_at" type date using ("created_at"::date);');
    this.addSql('alter table "bot"."logsettings" alter column "updated_at" type date using ("updated_at"::date);');

    this.addSql('alter table "bot"."settings" add column "moderators" text[] null;');

    this.addSql('alter table "bot"."streamleaderboard" alter column "created_at" type date using ("created_at"::date);');
    this.addSql('alter table "bot"."streamleaderboard" alter column "updated_at" type date using ("updated_at"::date);');

    this.addSql('alter table "bot"."streamwatch" alter column "starting_date" type date using ("starting_date"::date);');

    this.addSql('alter table "tokens" alter column "expires_in" type date using ("expires_in"::date);');
    this.addSql('alter table "tokens" alter column "created_at" type date using ("created_at"::date);');
    this.addSql('alter table "tokens" alter column "updated_at" type date using ("updated_at"::date);');

    this.addSql('alter table "users" alter column "created_at" type date using ("created_at"::date);');
    this.addSql('alter table "users" alter column "updated_at" type date using ("updated_at"::date);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "activity" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');

    this.addSql('alter table "bot"."guildtraffic" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');

    this.addSql('alter table "bot"."logsettings" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "bot"."logsettings" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');

    this.addSql('alter table "settings" drop column "moderators";');

    this.addSql('alter table "bot"."streamleaderboard" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "bot"."streamleaderboard" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');

    this.addSql('alter table "bot"."streamwatch" alter column "starting_date" type timestamptz(0) using ("starting_date"::timestamptz(0));');

    this.addSql('alter table "tokens" alter column "expires_in" type timestamptz(0) using ("expires_in"::timestamptz(0));');
    this.addSql('alter table "tokens" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "tokens" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');

    this.addSql('alter table "users" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "users" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
  }

}
