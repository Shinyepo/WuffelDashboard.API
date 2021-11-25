import { Migration } from '@mikro-orm/migrations';

export class Migration20211124140919 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "bot"."streamleaderboard" add column "username" varchar(255) not null, add column "nickname" varchar(255) not null;');
  }

}
