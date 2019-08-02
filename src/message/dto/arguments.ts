import { Field, InputType } from 'type-graphql'

@InputType()
export class NewMessage {
  @Field({ nullable: false })
  text: string

  @Field({ nullable: false })
  conversationId: number
}
