import { Module } from '@nestjs/common'
import { TenantResolver } from './tenant.resolver'
import { TenantService } from './tenant.service'
import { Tenant } from './models/tenant.model'
import { TypeOrmModule } from '@nestjs/typeorm'

console.log(parseInt(process.env.TYPEORM_PORT))

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantService, TenantResolver],
})
export class TenantModule {}
