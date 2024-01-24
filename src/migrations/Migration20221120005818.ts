import { Migration } from '@mikro-orm/migrations';

export class Migration20221120005818 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "guildprivilege" ("id" serial primary key, "user_ids" jsonb null, "guild_id" varchar(255) not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "guildprivilege" cascade;');
  }

}
