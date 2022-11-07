import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity({ tableName: "public.activity" })
export class Activity {
  @Field()
  @PrimaryKey()
  id: number;

  @Field()
  @Property()
  userId: string;

  @Field()
  @Property()
  guildId: string;

  @Field()
  @Property()
  activityType: boolean;

  @Field()
  @Property()
  activity: string;

  @Field(() => Date)
  @Property({ type: "date" })
  createdAt = new Date();
}
