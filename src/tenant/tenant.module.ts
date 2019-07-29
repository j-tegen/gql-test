import { Module } from '@nestjs/common'
import { TenantResolver } from './tenant.resolver'
import { TenantService } from './tenant.service'
import { Tenant } from './models/tenant.model'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from '@app/user/user.service'
import { User } from '@app/user/models/user.model'

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, User])],
  providers: [TenantService, UserService, TenantResolver],
})
export class TenantModule {}
