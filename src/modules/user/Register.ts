import { Resolver, Query, Mutation, Arg } from "type-graphql";
import * as bcrypt from "bcryptjs"
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";

@Resolver(User)
export class RegisterResolver {
  @Query(() => [User])
  async users() {
    return await User.find();
  }

  @Mutation(() => User)
  async register(
    @Arg('input') { email, username, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email, username, password: hashedPassword
    }).save();

    return user;
  }
}