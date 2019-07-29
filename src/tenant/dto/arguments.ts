import { MaxLength } from 'class-validator'
import { Field, ArgsType } from 'type-graphql'

@ArgsType()
export class NewTenant {
  @Field({ nullable: false })
  @MaxLength(50)
  name: string
}

@ArgsType()
export class RegisterTenant extends NewTenant {
  @Field({ nullable: false })
  @MaxLength(50)
  firstName: string

  @Field({ nullable: false })
  @MaxLength(50)
  lastName: string

  @Field({ nullable: false })
  @MaxLength(100)
  email: string

  @Field({ nullable: false })
  @MaxLength(50)
  password: string
}
