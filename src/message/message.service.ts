import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Message } from './models/message.model'
import { Conversation } from '@app/conversation/models/conversation.model'
import { User } from '@app/user/models/user.model'
import { Tenant } from '@app/tenant/models/tenant.model'

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  async createMessage(
    payload: Partial<Message>,
    conversation: Conversation,
    user: User,
    tenant: Tenant
  ): Promise<Message> {
    const message: Message = await this.messageRepository.create(payload)
    message.tenant = tenant
    message.user = user
    message.conversation = conversation
    return this.messageRepository.save(message)
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder('message')
      .innerJoinAndSelect('message.user', 'user')
      .where('conversationId = :conversationId', { conversationId })
      .getMany()
  }
}
