import { Int, Field, ObjectType } from 'type-graphql'

@ObjectType()
export class JWT {
  @Field(type => Int)
  expiresIn: number

  @Field()
  accessToken: string
}
