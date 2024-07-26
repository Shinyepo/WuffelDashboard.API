import { Migration } from '@mikro-orm/migrations';

export class Migration20240125110504 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "bot"."settings" alter column "moderators" type text[] using ("moderators"::text[]);');
    this.addSql('alter table "bot"."settings" alter column "moderators" set not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "bot"."settings" alter column "moderators" type text[] using ("moderators"::text[]);');
    this.addSql('alter table "bot"."settings" alter column "moderators" drop not null;');
  }

}
