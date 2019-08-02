import { Field, InputType } from 'type-graphql'

@InputType()
export class NewConversation {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  workspaceId?: number
}

@InputType()
export class ConversationUser {
  @Field({ nullable: false })
  conversationId: number

  @Field({ nullable: false })
  userId: number
}
