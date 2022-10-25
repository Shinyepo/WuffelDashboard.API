import { Migration } from '@mikro-orm/migrations';

export class Migration20221003114052 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "bot"."streamleaderboard" alter column "nickname" type varchar(255) using ("nickname"::varchar(255));');
    this.addSql('alter table "bot"."streamleaderboard" alter column "nickname" set not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "bot"."streamleaderboard" alter column "nickname" type varchar using ("nickname"::varchar);');
    this.addSql('alter table "bot"."streamleaderboard" alter column "nickname" drop not null;');
  }

}
