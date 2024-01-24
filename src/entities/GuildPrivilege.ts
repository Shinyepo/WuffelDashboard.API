import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { PrivilegedUser } from "../types";

@ObjectType()
@Entity({ tableName: "public.guildprivilege" })
export class GuildPrivilege {
  @Field()
  @PrimaryKey()
  id: number;

  @Field(() => [PrivilegedUser])
  @Property({ type: "json", nullable: true })
  userIds?: PrivilegedUser[];

  @Field()
  @Property()
  guildId: string;
}
