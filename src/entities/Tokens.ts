import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Tokens {
  @Field()
  @PrimaryKey()
  id: String;

  @Field()
  @Property()
  access_token: String;

  @Field()
  @Property()
  token_type: String;

  @Field()
  @Property()
  refresh_token: String;

  @Field(() => String)
  @Property({type: "date"})
  expires_in: Date;

  @Field()
  @Property()
  scope: String;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
