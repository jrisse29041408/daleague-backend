import { Resolver, Query, Ctx} from "type-graphql";
import { User } from "../../entity/User";
import { MyContext } from "src/types/MyContext";

@Resolver(User)
export class MeResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }

    return await User.findOne(ctx.req.session!.userId);
  }
}