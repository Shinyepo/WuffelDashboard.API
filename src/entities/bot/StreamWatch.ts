import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity({ tableName: "bot.streamwatch" })
export class StreamWatch {
  @Field()
  @PrimaryKey()
  id: number;

  @Field()
  @Property()
  guildId: string;

  @Field()
  @Property()
  userId: string;

  @Field(() => String)
  @Property({
    type: "date",
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  startingDate = new Date();
}

// useless comment