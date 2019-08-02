import { Module } from '@nestjs/common'
import { ConversationResolver } from './conversation.resolver'
import { ConversationService } from './conversation.service'
import { UserService } from '@app/user/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Conversation } from './models/conversation.model'
import { User } from '@app/user/models/user.model'
import { Message } from '@app/message/models/message.model'
import { MessageService } from '@app/message/message.service'
import { Workspace } from '@app/workspace/models/workspace.model'
import { WorkspaceService } from '@app/workspace/workspace.service'

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, User, Message, Workspace])],
  providers: [
    ConversationResolver,
    ConversationService,
    UserService,
    MessageService,
    WorkspaceService,
  ],
})
export class ConversationModule {}
