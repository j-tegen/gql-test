import { ArgsType, Field } from 'type-graphql'
import { MaxLength } from 'class-validator'

@ArgsType()
export class LoginArgs {
  @Field({ nullable: false })
  @MaxLength(100)
  email: string

  @Field({ nullable: false })
  @MaxLength(50)
  password: string
}
