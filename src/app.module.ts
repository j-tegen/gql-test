import { Module } from '@nestjs/common'
import { TenantModule } from './tenant/tenant.module'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ormConfig } from './config'
import { UserModule } from './user/user.module'
import './common/custom_types'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    TenantModule,
    UserModule,
    AuthModule,
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
