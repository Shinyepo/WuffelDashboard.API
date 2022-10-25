import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity({ tableName: "bot.guildtraffic" })
export class GuildTraffic {
  @Field()
  @PrimaryKey()
  id: number;

  @Field()
  @Property()
  guildId: string;

  @Field()
  @Property()
  userId: string;

  @Field({nullable: true})
  @Property({nullable: true})
  username: string;

  @Field({nullable: true})
  @Property({nullable: true})
  nickname: string;

  @Field()
  @Property()
  joined: boolean;

  @Field(() => Date)
  @Property({ type: "date", onCreate: () => new Date() })
  createdAt: Date;
}
