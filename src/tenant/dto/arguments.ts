import { MaxLength } from 'class-validator'
import { Field, ArgsType } from 'type-graphql'

@ArgsType()
export class NewTenant {
  @Field({ nullable: false })
  @MaxLength(50)
  name: string
}
