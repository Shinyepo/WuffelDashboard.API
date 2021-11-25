import { Migration } from '@mikro-orm/migrations';

export class Migration20211122144553 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "bot"."guildtraffic" add column "username" varchar(255) null, add column "nickname" varchar(255) null;');
  }

}
