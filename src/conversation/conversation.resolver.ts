import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
} from '@nestjs/graphql'
import { Conversation } from './models/conversation.model'
import { ConversationService } from './conversation.service'
import { UseGuards, NotFoundException } from '@nestjs/common'
import { User as CurrentUser } from '../auth/user.decorator'
import { GqlAuthGuard } from '@app/auth/graphql-auth.guard'
import { User } from '@app/user/models/user.model'
import { MessageService } from '@app/message/message.service'
import { Message } from '@app/message/models/message.model'
import { NewConversation, ConversationUser } from './dto/arguments'
import { UserService } from '@app/user/user.service'
import { WorkspaceService } from '@app/workspace/workspace.service'
import { Workspace } from '@app/workspace/models/workspace.model'

@Resolver(of => Conversation)
export class ConversationResolver {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly workspaceService: WorkspaceService
  ) {}

  @Mutation(returns => Conversation)
  @UseGuards(GqlAuthGuard)
  async addConversation(
    @Args('payload') payload: NewConversation,
    @CurrentUser() currentUser: User
  ): Promise<Conversation> {
    const workspace: Workspace = await this.workspaceService.getWorkspace(
      payload.workspaceId,
      currentUser.id
    )

    if (!workspace) {
      throw new NotFoundException('No such workspace or permission denied')
    }

    return this.conversationService.createConversation(
      payload,
      currentUser,
      workspace
    )
  }

  @Mutation(returns => Conversation)
  @UseGuards(GqlAuthGuard)
  async addConversationUser(
    @Args('payload') payload: ConversationUser,
    @CurrentUser() currentUser: User
  ): Promise<Conversation> {
    const conversation: Conversation = await this.conversationService.getConversation(
      payload.conversationId,
      currentUser.id
    )

    if (!conversation) {
      throw new NotFoundException('No such conversation or permission denied')
    }

    const user: User = await this.userService.getUserById(
      payload.userId,
      currentUser.tenant.id
    )
    if (!user) {
      throw new NotFoundException('No such user')
    }

    return this.conversationService.addUser(conversation, user)
  }

  @Mutation(returns => Conversation)
  @UseGuards(GqlAuthGuard)
  async removeConversationUser(
    @Args('payload') payload: ConversationUser,
    @CurrentUser() currentUser: User
  ): Promise<Conversation> {
    const conversation: Conversation = await this.conversationService.getConversation(
      payload.conversationId,
      currentUser.id
    )

    if (!conversation) {
      throw new NotFoundException('No such conversation or permission denied')
    }

    const user: User = await this.userService.getUserById(
      payload.userId,
      currentUser.tenant.id
    )
    if (!user) {
      throw new NotFoundException('No such user')
    }

    return this.conversationService.removeUser(conversation, user)
  }

  @Query(returns => Conversation, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async conversation(
    @Args('id') id: number,
    @CurrentUser() currentUser: User
  ): Promise<Conversation> {
    return this.conversationService.getConversation(id, currentUser.id)
  }

  @Query(returns => [Conversation], { nullable: true })
  @UseGuards(GqlAuthGuard)
  async myConversations(
    @CurrentUser() currentUser: User
  ): Promise<Conversation[]> {
    return this.conversationService.getUserConversations(currentUser.id)
  }

  @ResolveProperty(type => [User])
  async users(@Parent() conversation): Promise<User[]> {
    return this.userService.getConversationUsers(conversation.id)
  }

  @ResolveProperty(type => [Message])
  async messages(@Parent() conversation): Promise<Message[]> {
    return this.messageService.getMessages(conversation.id)
  }
}
