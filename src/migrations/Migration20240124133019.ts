import { Migration } from '@mikro-orm/migrations';

export class Migration20240124133019 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "bot"."settings" alter column "moderators" type text[] using ("moderators"::text[]);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "bot"."settings" alter column "moderators" type text using ("moderators"::text);');
  }

}
