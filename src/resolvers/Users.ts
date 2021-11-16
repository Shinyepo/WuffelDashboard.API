import { Users } from "../entities/Users";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";



@InputType()
class userInfo {
  @Field()
  userId: String;
  @Field()
  username: String;
  @Field()
  email: String;
}

@ObjectType()
class userError {
  @Field()
  field?: String;
  @Field()
  message: String;
}

@ObjectType()
class UserResponse {
  @Field(() => [userError], { nullable: true })
  errors?: userError[];
  @Field(() => [Users], { nullable: true })
  users?: Users[];
}

@Resolver()
export class UsersResolver {
  @Query(() => UserResponse)
  async users(@Ctx() { em, req }: MyContext): Promise<UserResponse> {
    if (!req.session.userId) {
      return {
        errors: [
          {
            field: "",
            message: "You are not logged in.",
          },
        ],
      };
    }
    const users = await em.find(Users, {});
    if (!users) {
      return {
        errors: [
          {
            field: "",
            message: "There are no registered users.",
          },
        ],
      };
    }
    return {
      users,
    };
  }

  @Query(() => UserResponse, { nullable: true })
  async user(
    @Arg("userId") userId: String,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(Users, { id: userId });
    if (!user) {
      return {
        errors: [
          {
            field: "userId",
            message: "There is no user",
          },
        ],
      };
    }
    return {
      users: [user],
    };
  }

  @Mutation(() => Users)
  async createUser(
    @Arg("options") { userId, username, email }: userInfo,
    @Ctx() { em }: MyContext
  ): Promise<Users> {
    const user = em.create(Users, {
      userId: userId,
      username: username,
      email: email,
    });
    await em.persistAndFlush(user);
    return user;
  }

  @Query(() => Users, { nullable: true })
  async loginUser(
    @Arg("username") username: String,
    @Ctx() { em, req }: MyContext
  ): Promise<Users | null> {    
    if (req.session.userId !== undefined) {
      return null;
    }
    const user = await em.findOne(Users, { username });
    if (!user) {
      return null;
    }

    req.session.userId = user.id;
    return user;
  }

  @Query(() => Boolean)
  async logoutUser(@Ctx() { req }: MyContext): Promise<Boolean> {
    if (!req.session.userId) {
      return false;
    }

    return new Promise((res) =>
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          res(false);
          return;
        }

        res(true);
      })
    );
  }
}

// req.session!.userId = user.id;
