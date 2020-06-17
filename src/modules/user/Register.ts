import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
import * as bcrypt from "bcryptjs"
import { User } from "../../entity/User";
import { RegisterInput } from "./register/RegisterInput";
import { isAuth } from "../middleware/isAuth";
import { sendMail } from "../../utils/sendMail";
import { createConformationUrl } from "../../utils/createConformationUrl";

@Resolver(User)
export class RegisterResolver {
  @UseMiddleware(isAuth)
  @Query(() => String)
  async hello() {
    return await 'hello';
  }

  @Mutation(() => User)
  async register(
    @Arg('input') { email, username, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email, username, password: hashedPassword
    }).save();

    await sendMail(email, await createConformationUrl(user.id));

    return user;
  }
}