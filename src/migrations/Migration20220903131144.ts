import { Migration } from '@mikro-orm/migrations';

export class Migration20220903131144 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "bot"."settings" add column "active" bool not null, add column "guild_role" varchar(255) null;');
  }

}
