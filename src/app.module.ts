import { Module } from '@nestjs/common'
import { TenantModule } from './tenant/tenant.module'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ormConfig } from './config'

console.log('PORT: ', parseInt(process.env.TYPEORM_PORT))

@Module({
  imports: [
    TenantModule,
    TypeOrmModule.forRoot(ormConfig),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
    }),
  ],
})
export class AppModule {}
