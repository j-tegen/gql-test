import { Module } from '@nestjs/common'
import { MessageService } from './message.service'
import { MessageResolver } from './message.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Message } from './models/message.model'
import { User } from '@app/user/models/user.model'
import { UserService } from '@app/user/user.service'
import { Conversation } from '@app/conversation/models/conversation.model'
import { ConversationService } from '@app/conversation/conversation.service'

@Module({
  imports: [TypeOrmModule.forFeature([Message, User, Conversation])],
  providers: [
    MessageService,
    MessageResolver,
    UserService,
    ConversationService,
  ],
})
export class MessageModule {}
