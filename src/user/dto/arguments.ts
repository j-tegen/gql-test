import { MaxLength } from 'class-validator'
import { Field, ArgsType, InputType } from 'type-graphql'

@InputType()
export class UserArgs {
  @Field({ nullable: false })
  @MaxLength(50)
  firstName: string

  @Field({ nullable: false })
  @MaxLength(50)
  lastName: string

  @Field({ nullable: false })
  @MaxLength(100)
  email: string

  @Field({ nullable: true, defaultValue: '' })
  @MaxLength(100)
  phone?: string
}

@InputType()
export class NewUser extends UserArgs {
  @Field({ nullable: false })
  @MaxLength(50)
  password: string
}

@InputType()
export class UserBatch {
  @Field(type => [NewUser])
  users: NewUser[]
}
