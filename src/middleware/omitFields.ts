import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types";

export const omitTypename: MiddlewareFn<MyContext> = async (
  { context, args },
  next
) => {
  if (args) {
    const omitTypename = (key: string, value: any) =>
      key === "__typename" ? undefined : value;
    args = JSON.parse(JSON.stringify(args), omitTypename);
  }
  return next();
};
