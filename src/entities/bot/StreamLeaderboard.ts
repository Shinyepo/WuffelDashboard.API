import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity({ tableName: "bot.streamleaderboard" })
export class StreamLeaderboard {
  @Field()
  @PrimaryKey()
  id: number;

  @Field()
  @Property()
  guildId: string;

  @Field()
  @Property()
  userId: string;

  @Field()
  @Property()
  username: string;

  @Field({nullable: true})
  @Property({nullable: true})
  nickname?: string;

  @Field()
  @Property()
  timeStreamed: string;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
