import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
  Subscription,
} from '@nestjs/graphql'

import { Conversation } from '@app/conversation/models/conversation.model'
import { MessageService } from './message.service'
import { UseGuards, NotFoundException } from '@nestjs/common'
import { GqlAuthGuard } from '@app/auth/graphql-auth.guard'
import { User as CurrentUser } from '../auth/user.decorator'
import { User } from '@app/user/models/user.model'
import { Message } from './models/message.model'
import { UserService } from '@app/user/user.service'
import { NewMessage } from './dto/arguments'
import { ConversationService } from '@app/conversation/conversation.service'
import { SubscriptionTypes } from '@app/enums/subscription-types'
import { PubSub } from 'graphql-subscriptions'

const pubSub = new PubSub()

@Resolver(of => Conversation)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly conversationService: ConversationService
  ) {}

  @Query(returns => [Message], { nullable: true })
  @UseGuards(GqlAuthGuard)
  async messages(
    @Args('conversationId') conversationId: number
  ): Promise<Message[]> {
    return this.messageService.getMessages(conversationId)
  }

  @Mutation(returns => Message, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async addMessage(
    @Args('message') payload: NewMessage,
    @CurrentUser() currentUser: User
  ): Promise<Message> {
    const conversation: Conversation = await this.conversationService.getConversation(
      payload.conversationId,
      currentUser.id
    )
    if (!conversation) {
      throw new NotFoundException('No such conversation')
    }
    const message: Message = await this.messageService.createMessage(
      payload,
      conversation,
      currentUser,
      currentUser.tenant
    )

    pubSub.publish(SubscriptionTypes.MessageAdded, { messageAdded: message })
    return message
  }

  @ResolveProperty(returns => User)
  async user(@Parent() message: Message): Promise<User> {
    return this.userService.getUserById(message.user.id, message.tenant.id)
  }

  @Subscription(returns => Message, {
    filter: (payload, variables) => {
      return payload.messageAdded.conversation.id === variables.conversationId
    },
  })
  messageAdded(@Args('conversationId') conversationId: number) {
    return pubSub.asyncIterator<Message>(SubscriptionTypes.MessageAdded)
  }
}
