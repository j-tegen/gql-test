import { Module } from '@nestjs/common'
import { TenantModule } from './tenant/tenant.module'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ormConfig } from './config'
import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ConversationModule } from './conversation/conversation.module'
import { MessageModule } from './message/message.module'
import { WorkspaceModule } from './workspace/workspace.module'
import './common/custom_types'

@Module({
  imports: [
    TenantModule,
    UserModule,
    AuthModule,
    ConversationModule,
    MessageModule,
    WorkspaceModule,
    TypeOrmModule.forRoot(ormConfig),
    GraphQLModule.forRoot({
      context: ({ req }: any) => ({ req }),
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      playground: true,
    }),
  ],
})
export class AppModule {}
