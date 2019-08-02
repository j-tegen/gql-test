import {
  Resolver,
  Args,
  Query,
  ResolveProperty,
  Parent,
  Mutation,
} from '@nestjs/graphql'
import { WorkspaceService } from './workspace.service'
import { Workspace } from './models/workspace.model'
import { UseGuards, NotFoundException } from '@nestjs/common'
import { GqlAuthGuard } from '@app/auth/graphql-auth.guard'
import { User as CurrentUser } from '../auth/user.decorator'
import { User } from '@app/user/models/user.model'
import { UserService } from '@app/user/user.service'
import { Conversation } from '@app/conversation/models/conversation.model'
import { ConversationService } from '@app/conversation/conversation.service'
import { NewWorkspace, WorkspaceUser } from './dto/arguments'

@Resolver('Workspace')
export class WorkspaceResolver {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly userService: UserService,
    private readonly conversationService: ConversationService
  ) {}

  @Mutation(returns => Workspace)
  @UseGuards(GqlAuthGuard)
  async addWorkspace(
    @Args('payload') workspace: NewWorkspace,
    @CurrentUser() currentUser: User
  ): Promise<Workspace> {
    return this.workspaceService.createWorkspace(
      workspace,
      currentUser,
      currentUser.tenant
    )
  }

  @Mutation(returns => Workspace)
  @UseGuards(GqlAuthGuard)
  async addWorkspaceUser(
    @Args('payload') payload: WorkspaceUser,
    @CurrentUser() currentUser: User
  ): Promise<Workspace> {
    const workspace: Workspace = await this.workspaceService.getWorkspace(
      payload.workspaceId,
      currentUser.id
    )

    if (!workspace) {
      throw new NotFoundException('No such workspace or permission denied')
    }

    const user: User = await this.userService.getUserById(
      payload.userId,
      currentUser.tenant.id
    )
    if (!user) {
      throw new NotFoundException('No such user')
    }

    return this.workspaceService.addUser(workspace, user)
  }

  @Mutation(returns => Workspace)
  @UseGuards(GqlAuthGuard)
  async removeWorkspaceUser(
    @Args('payload') payload: WorkspaceUser,
    @CurrentUser() currentUser: User
  ): Promise<Workspace> {
    const workspace: Workspace = await this.workspaceService.getWorkspace(
      payload.workspaceId,
      currentUser.id
    )

    if (!workspace) {
      throw new NotFoundException('No such workspace or permission denied')
    }

    const user: User = await this.userService.getUserById(
      payload.userId,
      currentUser.tenant.id
    )
    if (!user) {
      throw new NotFoundException('No such user')
    }

    return this.workspaceService.removeUser(workspace, user)
  }

  @Query(returns => Workspace, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async workspace(
    @Args('id') id: number,
    @CurrentUser() currentUser: User
  ): Promise<Workspace> {
    return this.workspaceService.getWorkspace(id, currentUser.id)
  }

  @Query(returns => [Workspace], { nullable: true })
  @UseGuards(GqlAuthGuard)
  async myWorkspaces(@CurrentUser() currentUser: User): Promise<Workspace[]> {
    return this.workspaceService.getUserWorkspaces(currentUser.id)
  }

  @ResolveProperty(type => [User])
  async users(@Parent() workspace): Promise<User[]> {
    return this.userService.getWorkspaceUsers(workspace.id)
  }

  @ResolveProperty(type => [Conversation])
  async getConversations(@Parent() workspace): Promise<Conversation[]> {
    return this.conversationService.getWorkspaceConversations(workspace.id)
  }
}
