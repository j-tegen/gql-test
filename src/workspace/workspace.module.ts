import { Module } from '@nestjs/common'
import { WorkspaceResolver } from './workspace.resolver'
import { WorkspaceService } from './workspace.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Workspace } from './models/workspace.model'
import { User } from '@app/user/models/user.model'
import { Conversation } from '@app/conversation/models/conversation.model'
import { Tenant } from '@app/tenant/models/tenant.model'
import { ConversationService } from '@app/conversation/conversation.service'
import { UserService } from '@app/user/user.service'

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, User, Conversation, Tenant])],
  providers: [
    WorkspaceResolver,
    WorkspaceService,
    ConversationService,
    UserService,
  ],
})
export class WorkspaceModule {}
