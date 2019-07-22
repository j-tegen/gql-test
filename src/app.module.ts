import { Module } from '@nestjs/common'
import { TenantModule } from './tenant/tenant.module'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ormConfig } from './config'

@Module({
  imports: [
    TenantModule,
    TypeOrmModule.forRoot(ormConfig),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      playground: true,
    }),
  ],
})
export class AppModule {}
