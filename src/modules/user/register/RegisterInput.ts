import { Length, IsEmail } from "class-validator";
import { InputType, Field } from "type-graphql";
import { DoesEmailExist } from "./DoesEmailExist";

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  @DoesEmailExist({message: "Email already exist"})
  email: string;

  @Field()
  @Length(1, 255)
  username: string;

  @Field()
  password: string;
}