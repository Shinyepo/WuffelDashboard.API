import { MyContext } from "../types";
import {
  Ctx,
  Query,
  Resolver,
} from "type-graphql";


@Resolver()
export class UsersResolver {
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
