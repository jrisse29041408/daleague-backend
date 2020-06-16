import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn() id: number;

  @Field()
  @Column("varchar", { length: 255, unique: true })
  email: string;

  @Field()
  @Column("text")
  username: string;

  @Column("text")
  password: string;
}