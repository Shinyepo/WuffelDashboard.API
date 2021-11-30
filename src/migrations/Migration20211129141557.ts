import { Migration } from '@mikro-orm/migrations';

export class Migration20211129141557 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "bot"."logsettings" ("id" serial primary key, "guild_id" varchar(255) not null, "settings" jsonb null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
  }

}
