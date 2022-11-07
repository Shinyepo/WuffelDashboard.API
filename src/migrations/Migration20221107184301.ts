import { Migration } from '@mikro-orm/migrations';

export class Migration20221107184301 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "activity" add column "username" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "activity" drop column "username";');
  }

}
