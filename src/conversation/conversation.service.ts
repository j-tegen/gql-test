import { Injectable } from '@nestjs/common'
import { Conversation } from './models/conversation.model'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '@app/user/models/user.model'
import { Workspace } from '@app/workspace/models/workspace.model'

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>
  ) {}

  async createConversation(
    payload: Partial<Conversation>,
    user: User,
    workspace: Workspace
  ) {
    const conversation: Conversation = await this.conversationRepository.create(
      payload
    )

    conversation.tenant = user.tenant
    conversation.users = [user]
    conversation.workspace = workspace
    return this.conversationRepository.save(conversation)
  }

  async addUser(conversation: Conversation, user: User): Promise<Conversation> {
    const currentUsers: User[] = conversation.users
    conversation.users = Array.from(new Set([...currentUsers, user]))
    return this.conversationRepository.save(conversation)
  }

  async removeUser(
    conversation: Conversation,
    user: User
  ): Promise<Conversation> {
    const currentUsers: User[] = conversation.users
    conversation.users = currentUsers.filter((u: User) => u.id !== user.id)
    return this.conversationRepository.save(conversation)
  }

  async getConversation(id: number, userId: number): Promise<Conversation> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .innerJoin('conversation.users', 'user')
      .where('conversation.id = :id AND user.id = :userId', { id, userId })
      .getOne()
  }

  async getWorkspaceConversations(
    workspaceId: number
  ): Promise<Conversation[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .where('workspaceId = :workspaceId', { workspaceId })
      .getMany()
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .where('userId = :userId', { userId })
      .getMany()
  }
}
